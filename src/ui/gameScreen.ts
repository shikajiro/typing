// ゲーム本編：ことばのローマ字を打つ → 人物/できごとが あらわれる → ずかんに登録 → ワールドクリア。
// あつかうテーマ（せんごく／にほんし／にほんぶんか）は collection で受け取る。

import { getKeySpec } from "../core/keyboardLayout";
import { collectId, isWorldCleared, unlockWorld } from "../core/progress";
import { createWordSession, expectedCode, pressKey, progressChars, type WordSession } from "../core/typingEngine";
import type { Collection } from "../data/collections";
import { type GameWord, romajiOf } from "../data/words";
import { clear, el, renderRuby, ruby } from "./dom";
import { KeyboardView } from "./keyboardView";
import type { AppContext } from "./types";

function kindTagText(entry: GameWord): string {
  if (entry.kind === "event") return "📜 できごと";
  if (entry.kind === "culture") return "🏛️ 文化財";
  return "";
}

export function renderGameScreen(ctx: AppContext, collection: Collection, worldId: number): () => void {
  const world = collection.getWorld(worldId);
  const allWords = collection.wordsByWorld(worldId);
  const memberIds = allWords.map((entry) => entry.id);

  const startProgress = ctx.getProgress();
  const uncollected = allWords.filter((entry) => !startProgress.collectedIds.includes(entry.id));
  const isReplay = uncollected.length === 0;
  const queue = isReplay ? allWords : uncollected;
  let queueIndex = 0;

  const timeouts: number[] = [];
  let session: WordSession = createWordSession(queue[0].reading);

  const keyboard = new KeyboardView();
  keyboard.setAssistLevel(startProgress.settings.assistLevel);

  const figureEl = el("div", { class: "creature", text: "❔" });
  const imgEl = el("img", { class: "portrait" });
  imgEl.style.display = "none";
  const tagEl = el("div", { class: "kind-tag" });
  const nameEl = el("div", { class: "word-name" });
  const descEl = el("div", { class: "word-desc" });
  const tilesEl = el("div", { class: "word-tiles" });
  const hintEl = el("div", { class: "finger-hint" });
  const countEl = el("div", { class: "count" });

  const listenBtn = el("button", {
    class: "listen-button",
    text: "🔊 きいてみる",
    onClick: () => ctx.audio.speak(queue[queueIndex].reading)
  });

  const stage = el("main", { class: "stage" }, [
    el("div", { class: "egg-area" }, [figureEl, imgEl]),
    tagEl,
    nameEl,
    descEl,
    tilesEl,
    listenBtn,
    hintEl
  ]);

  const keyboardWrap = el("div", { class: "keyboard-wrap" }, [keyboard.el]);

  const screen = el("div", { class: "screen game-screen" }, [
    el("header", { class: "topbar" }, [
      el("button", {
        class: "back-button",
        text: "← もどる",
        onClick: () => ctx.navigate({ name: "worldmap", theme: collection.key })
      }),
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
    const done = progressChars(session);
    tileEls.forEach((tile, i) => {
      tile.classList.toggle("is-done", i < done);
      tile.classList.toggle("is-current", i === done && !session.done);
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
    session = createWordSession(entry.reading);
    figureEl.textContent = "❔";
    figureEl.classList.remove("pop");
    figureEl.style.display = "";
    imgEl.style.display = "none";
    imgEl.classList.remove("pop");
    tagEl.textContent = kindTagText(entry);
    nameEl.replaceChildren(ruby(entry.name, entry.reading));
    descEl.replaceChildren(...renderRuby(entry.description));

    tileEls = Array.from(romajiOf(entry)).map((letter) => el("div", { class: "tile", text: letter.toUpperCase() }));
    tilesEl.replaceChildren(...tileEls);

    keyboard.setAssistLevel(ctx.getProgress().settings.assistLevel);
    keyboard.highlightNext(expectedCode(session));
    updateTiles();
    updateHint();
    ctx.audio.speak(entry.reading);
  }

  function reveal(entry: GameWord): void {
    if (entry.image) {
      imgEl.src = entry.image;
      imgEl.style.display = "block";
      imgEl.classList.add("pop");
      figureEl.style.display = "none";
    } else {
      figureEl.textContent = entry.emoji;
      figureEl.classList.add("pop");
    }
    keyboard.highlightNext(null);
    hintEl.replaceChildren(ruby(entry.name, entry.reading), document.createTextNode(" を ゲット！"));
    ctx.audio.sfx("hatch");
    ctx.audio.speak(entry.reading);

    const updated = ctx.update((progress) => collectId(progress, entry.id));
    updateTiles();
    updateCount();

    const cleared = !isReplay && isWorldCleared(updated, memberIds);
    if (cleared) {
      const nextId = collection.nextWorldId(worldId);
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
    const message = nextId !== null ? "つぎの ステージが あいたよ！" : collection.completeMessage;
    clear(stage);
    stage.append(
      el("div", { class: "clear-area" }, [
        el("div", { class: "clear-emoji", text: "🎉" }),
        el("div", { class: "clear-title", text: "クリア！ あっぱれ！" }),
        el("div", { class: "clear-sub", text: message }),
        el("button", {
          class: "big-button",
          text: "ステージに もどる",
          onClick: () => ctx.navigate({ name: "worldmap", theme: collection.key })
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
