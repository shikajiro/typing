// ゲーム本編：戦国ことばのローマ字を打つ → 武将/武具が あらわれる → なかまに/ずかんに登録 → ワールドクリア。

import { getKeySpec } from "../core/keyboardLayout";
import { collectId, isWorldCleared, unlockWorld } from "../core/progress";
import { createWordSession, expectedCode, pressKey, type WordSession } from "../core/typingEngine";
import { type GameWord, wordsByWorld, worldWordIds } from "../data/words";
import { getWorld, nextWorldId } from "../data/worlds";
import { clear, el, ruby } from "./dom";
import { KeyboardView } from "./keyboardView";
import type { AppContext } from "./types";

export function renderGameScreen(ctx: AppContext, worldId: number): () => void {
  const world = getWorld(worldId);
  const allWords = wordsByWorld(worldId);
  const memberIds = worldWordIds(worldId);

  const startProgress = ctx.getProgress();
  const uncollected = allWords.filter((entry) => !startProgress.collectedIds.includes(entry.id));
  const isReplay = uncollected.length === 0;
  const queue = isReplay ? allWords : uncollected;
  let queueIndex = 0;

  const timeouts: number[] = [];
  let session: WordSession = createWordSession(queue[0].word);

  const keyboard = new KeyboardView();
  keyboard.setAssistLevel(startProgress.settings.assistLevel);

  const figureEl = el("div", { class: "creature", text: "❔" });
  const nameEl = el("div", { class: "word-name" });
  const tilesEl = el("div", { class: "word-tiles" });
  const hintEl = el("div", { class: "finger-hint" });
  const countEl = el("div", { class: "count" });

  const listenBtn = el("button", {
    class: "listen-button",
    text: "🔊 きいてみる",
    onClick: () => ctx.audio.speak(queue[queueIndex].reading)
  });

  const stage = el("main", { class: "stage" }, [
    el("div", { class: "egg-area" }, [figureEl]),
    nameEl,
    tilesEl,
    listenBtn,
    hintEl
  ]);

  const keyboardWrap = el("div", { class: "keyboard-wrap" }, [keyboard.el]);

  const screen = el("div", { class: "screen game-screen" }, [
    el("header", { class: "topbar" }, [
      el("button", { class: "back-button", text: "← もどる", onClick: () => ctx.navigate({ name: "worldmap" }) }),
      el("div", { class: "world-name", text: world.name }),
      countEl
    ]),
    stage,
    keyboardWrap
  ]);

  let tileEls: HTMLElement[] = [];

  function updateCount(): void {
    const collected = memberIds.filter((id) => ctx.getProgress().collectedIds.includes(id)).length;
    countEl.textContent = `${collected}/${memberIds.length}`;
  }

  function updateTiles(): void {
    tileEls.forEach((tile, i) => {
      tile.classList.toggle("is-done", i < session.index);
      tile.classList.toggle("is-current", i === session.index && !session.done);
    });
  }

  function updateHint(): void {
    const code = expectedCode(session);
    const assistLevel = ctx.getProgress().settings.assistLevel;
    if (!code || assistLevel !== 1) {
      hintEl.replaceChildren();
      return;
    }
    const spec = getKeySpec(code);
    const swatch = el("span", { class: "swatch" });
    swatch.style.background = spec.color;
    hintEl.replaceChildren(document.createTextNode("つぎは "), swatch, document.createTextNode(` ${spec.fingerLabel}`));
  }

  function startWord(entry: GameWord): void {
    session = createWordSession(entry.word);
    figureEl.textContent = "❔";
    figureEl.classList.remove("pop");
    nameEl.replaceChildren(ruby(entry.name, entry.reading));

    tileEls = Array.from(entry.word).map((letter) => el("div", { class: "tile", text: letter.toUpperCase() }));
    tilesEl.replaceChildren(...tileEls);

    keyboard.setAssistLevel(ctx.getProgress().settings.assistLevel);
    keyboard.highlightNext(expectedCode(session));
    updateTiles();
    updateHint();
    ctx.audio.speak(entry.reading);
  }

  function reveal(entry: GameWord): void {
    figureEl.textContent = entry.emoji;
    figureEl.classList.add("pop");
    keyboard.highlightNext(null);
    hintEl.replaceChildren(ruby(entry.name, entry.reading), document.createTextNode(" を ゲット！"));
    ctx.audio.sfx("hatch");
    ctx.audio.speak(entry.reading);

    const updated = ctx.update((progress) => collectId(progress, entry.id));
    updateTiles();
    updateCount();

    const cleared = !isReplay && isWorldCleared(updated, memberIds);
    if (cleared) {
      const nextId = nextWorldId(worldId);
      if (nextId !== null) {
        ctx.update((progress) => unlockWorld(progress, nextId));
      }
      timeouts.push(window.setTimeout(() => showWorldClear(nextId), 1400));
      return;
    }

    timeouts.push(
      window.setTimeout(() => {
        queueIndex = (queueIndex + 1) % queue.length;
        startWord(queue[queueIndex]);
      }, 1400)
    );
  }

  function showWorldClear(nextId: number | null): void {
    ctx.audio.sfx("clear");
    keyboardWrap.style.display = "none";
    const message = nextId !== null ? "つぎの ステージが あいたよ！" : "ぜんぶ あつめたね！てんかとういつ！";
    clear(stage);
    stage.append(
      el("div", { class: "clear-area" }, [
        el("div", { class: "clear-emoji", text: "🎉" }),
        el("div", { class: "clear-title", text: "クリア！ あっぱれ！" }),
        el("div", { class: "clear-sub", text: message }),
        el("button", {
          class: "big-button",
          text: "ステージに もどる",
          onClick: () => ctx.navigate({ name: "worldmap" })
        })
      ])
    );
  }

  function onKey(event: KeyboardEvent): void {
    if (event.repeat) return;
    if (!/^Key[A-Z]$/.test(event.code)) return;
    event.preventDefault();
    if (session.done) return;

    const result = pressKey(session, event.code);
    session = result.session;

    if (!result.correct) {
      ctx.audio.sfx("wrong");
      tilesEl.classList.remove("shake");
      void tilesEl.offsetWidth;
      tilesEl.classList.add("shake");
      keyboard.flashWrong(event.code);
      return;
    }

    ctx.audio.sfx("correct");
    keyboard.highlightNext(expectedCode(session));
    updateTiles();
    updateHint();

    if (result.completed) {
      reveal(queue[queueIndex]);
    }
  }

  window.addEventListener("keydown", onKey);
  ctx.root.replaceChildren(screen);
  startWord(queue[0]);
  updateCount();

  return () => {
    window.removeEventListener("keydown", onKey);
    for (const id of timeouts) window.clearTimeout(id);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };
}
