// ゆびのたいそう：ホームポジションのキーを順番に押す、いちばんやさしい入口。
// 触りたての子向けなので、補助はつねに最大（キーボードを見せてハイライト）。

import { getKeySpec } from "../core/keyboardLayout";
import { clear, el } from "./dom";
import { KeyboardView } from "./keyboardView";
import type { AppContext } from "./types";

const WARMUP_SEQUENCE = ["KeyF", "KeyJ", "KeyF", "KeyJ", "KeyD", "KeyK", "KeyS", "KeyL", "KeyA"];

export function renderWarmupScreen(ctx: AppContext): () => void {
  let index = 0;

  const keyboard = new KeyboardView();
  keyboard.setAssistLevel(1);

  const keyEl = el("div", { class: "warmup-key" });
  const hintEl = el("div", { class: "finger-hint" });
  const countEl = el("div", { class: "count" });
  const instructionEl = el("div", { class: "warmup-instruction", text: "この キーを おして！" });

  const stage = el("main", { class: "stage" }, [instructionEl, keyEl, hintEl]);

  const screen = el("div", { class: "screen warmup-screen" }, [
    el("header", { class: "topbar" }, [
      el("button", { class: "back-button", text: "← もどる", onClick: () => ctx.navigate({ name: "menu" }) }),
      el("div", { class: "world-name", text: "ゆびの たいそう" }),
      countEl
    ]),
    stage,
    el("div", { class: "keyboard-wrap" }, [keyboard.el])
  ]);

  function showCurrent(): void {
    const spec = getKeySpec(WARMUP_SEQUENCE[index]);
    keyEl.textContent = spec.label;
    keyboard.highlightNext(spec.code);
    countEl.textContent = `${index + 1}/${WARMUP_SEQUENCE.length}`;

    const swatch = el("span", { class: "swatch" });
    swatch.style.background = spec.color;
    hintEl.replaceChildren(swatch, document.createTextNode(` ${spec.fingerLabel}`));
  }

  function finish(): void {
    ctx.audio.sfx("clear");
    keyboard.highlightNext(null);
    clear(stage);
    stage.append(
      el("div", { class: "clear-area" }, [
        el("div", { class: "clear-emoji", text: "💮" }),
        el("div", { class: "clear-title", text: "じょうずに できたね！" }),
        el("div", { class: "clear-sub", text: "つぎは どうぶつを あつめよう！" }),
        el("button", { class: "big-button", text: "メニューに もどる", onClick: () => ctx.navigate({ name: "menu" }) })
      ])
    );
  }

  function onKey(event: KeyboardEvent): void {
    if (!/^Key[A-Z]$/.test(event.code)) return;
    event.preventDefault();

    if (event.code === WARMUP_SEQUENCE[index]) {
      ctx.audio.sfx("correct");
      index += 1;
      if (index >= WARMUP_SEQUENCE.length) {
        finish();
        return;
      }
      showCurrent();
    } else {
      ctx.audio.sfx("wrong");
      keyboard.flashWrong(event.code);
      keyEl.classList.remove("shake");
      void keyEl.offsetWidth;
      keyEl.classList.add("shake");
    }
  }

  window.addEventListener("keydown", onKey);
  ctx.root.replaceChildren(screen);
  showCurrent();

  return () => {
    window.removeEventListener("keydown", onKey);
  };
}
