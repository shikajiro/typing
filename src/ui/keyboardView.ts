// 画面キーボード部品。次に押すキーをハイライトし、補助レベルで見せ方を変える。
// ゲーム画面・ウォームアップ画面の両方で使う。

import { KEY_ROWS, getKeySpec } from "../core/keyboardLayout";
import type { AssistLevel } from "../core/progress";

export class KeyboardView {
  readonly el: HTMLElement;
  private readonly keyEls = new Map<string, HTMLElement>();
  private currentNext: string | null = null;

  constructor() {
    this.el = document.createElement("div");
    this.el.className = "keyboard assist-1";

    for (const row of KEY_ROWS) {
      const rowEl = document.createElement("div");
      rowEl.className = "keyboard-row";
      for (const code of row) {
        const spec = getKeySpec(code);
        const keyEl = document.createElement("div");
        keyEl.className = "key";
        keyEl.dataset.code = code;
        keyEl.textContent = spec.label;
        keyEl.style.setProperty("--finger-color", spec.color);
        rowEl.appendChild(keyEl);
        this.keyEls.set(code, keyEl);
      }
      this.el.appendChild(rowEl);
    }
  }

  setAssistLevel(level: AssistLevel): void {
    this.el.classList.remove("assist-1", "assist-2", "assist-3");
    this.el.classList.add(`assist-${level}`);
  }

  highlightNext(code: string | null): void {
    if (this.currentNext) {
      this.keyEls.get(this.currentNext)?.classList.remove("is-next");
    }
    this.currentNext = code;
    if (code) {
      this.keyEls.get(code)?.classList.add("is-next");
    }
  }

  flashWrong(code: string | null): void {
    if (!code) return;
    const keyEl = this.keyEls.get(code);
    if (!keyEl) return;
    keyEl.classList.remove("is-wrong");
    void keyEl.offsetWidth; // アニメーションを再スタートさせる
    keyEl.classList.add("is-wrong");
  }
}
