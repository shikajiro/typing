// ゲーム本編：どうぶつの英単語を打つ → たまごがかえる → ずかんに登録 → ワールドクリア。

import { getKeySpec } from "../core/keyboardLayout";
import { collectAnimal, isWorldCleared, unlockWorld } from "../core/progress";
import { createWordSession, expectedCode, pressKey, type WordSession } from "../core/typingEngine";
import { type Animal, animalsByWorld, worldAnimalIds } from "../data/animals";
import { getWorld, nextWorldId } from "../data/worlds";
import { clear, el } from "./dom";
import { KeyboardView } from "./keyboardView";
import type { AppContext } from "./types";

export function renderGameScreen(ctx: AppContext, worldId: number): () => void {
  const world = getWorld(worldId);
  const allAnimals = animalsByWorld(worldId);
  const worldIds = worldAnimalIds(worldId);

  const startProgress = ctx.getProgress();
  const uncollected = allAnimals.filter((animal) => !startProgress.collectedAnimalIds.includes(animal.id));
  const isReplay = uncollected.length === 0;
  const queue = isReplay ? allAnimals : uncollected;
  let queueIndex = 0;

  const timeouts: number[] = [];
  let session: WordSession = createWordSession(queue[0].word);

  const keyboard = new KeyboardView();
  keyboard.setAssistLevel(startProgress.settings.assistLevel);

  const creatureEl = el("div", { class: "creature", text: "🥚" });
  const kanaEl = el("div", { class: "kana" });
  const tilesEl = el("div", { class: "word-tiles" });
  const hintEl = el("div", { class: "finger-hint" });
  const countEl = el("div", { class: "count" });

  const listenBtn = el("button", {
    class: "listen-button",
    text: "🔊 きいてみる",
    onClick: () => ctx.audio.speakWord(queue[queueIndex].word)
  });

  const stage = el("main", { class: "stage" }, [
    el("div", { class: "egg-area" }, [creatureEl]),
    kanaEl,
    tilesEl,
    listenBtn,
    hintEl
  ]);

  const topbar = el("header", { class: "topbar" }, [
    el("button", { class: "back-button", text: "← もどる", onClick: () => ctx.navigate({ name: "worldmap" }) }),
    el("div", { class: "world-name", text: world.name }),
    countEl
  ]);

  const screen = el("div", { class: "screen game-screen" }, [
    topbar,
    stage,
    el("div", { class: "keyboard-wrap" }, [keyboard.el])
  ]);

  let tileEls: HTMLElement[] = [];

  function updateCount(): void {
    const collected = worldIds.filter((id) => ctx.getProgress().collectedAnimalIds.includes(id)).length;
    countEl.textContent = `${collected}/${worldIds.length}`;
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

  function startWord(animal: Animal): void {
    session = createWordSession(animal.word);
    creatureEl.textContent = "🥚";
    creatureEl.classList.remove("pop");
    kanaEl.textContent = animal.kana;

    tileEls = Array.from(animal.word).map((letter) => el("div", { class: "tile", text: letter.toUpperCase() }));
    tilesEl.replaceChildren(...tileEls);

    keyboard.setAssistLevel(ctx.getProgress().settings.assistLevel);
    keyboard.highlightNext(expectedCode(session));
    updateTiles();
    updateHint();
    ctx.audio.speakWord(animal.word);
  }

  function hatch(animal: Animal): void {
    creatureEl.textContent = animal.emoji;
    creatureEl.classList.add("pop");
    keyboard.highlightNext(null);
    hintEl.textContent = `やったね！ ${animal.kana} を ゲット！`;
    ctx.audio.sfx("hatch");
    ctx.audio.speakWord(animal.word);

    const updated = ctx.update((progress) => collectAnimal(progress, animal.id));
    updateTiles();
    updateCount();

    const cleared = !isReplay && isWorldCleared(updated, worldIds);
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
    const message = nextId !== null ? "つぎの ワールドが あいたよ！" : "ぜんぶ あつめたね！すごい！";
    clear(stage);
    stage.append(
      el("div", { class: "clear-area" }, [
        el("div", { class: "clear-emoji", text: "🎉" }),
        el("div", { class: "clear-title", text: "クリア！ おめでとう！" }),
        el("div", { class: "clear-sub", text: message }),
        el("button", {
          class: "big-button",
          text: "ワールドに もどる",
          onClick: () => ctx.navigate({ name: "worldmap" })
        })
      ])
    );
  }

  function onKey(event: KeyboardEvent): void {
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
      hatch(queue[queueIndex]);
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
