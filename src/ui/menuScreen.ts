// ホームメニュー。あそびの入口と、おたすけ（補助レベル）・おとの設定。

import { type AssistLevel, setAssistLevel, setSoundOn } from "../core/progress";
import { el } from "./dom";
import type { AppContext } from "./types";

const ASSIST_LABELS: Record<AssistLevel, string> = {
  1: "しょしんしゃ",
  2: "なれてきた",
  3: "たつじん"
};

export function renderMenuScreen(ctx: AppContext): () => void {
  const progress = ctx.getProgress();

  const assistButtons = ([1, 2, 3] as AssistLevel[]).map((level) =>
    el("button", {
      class: progress.settings.assistLevel === level ? "chip is-on" : "chip",
      text: ASSIST_LABELS[level],
      onClick: () => {
        ctx.update((p) => setAssistLevel(p, level));
        ctx.navigate({ name: "menu" });
      }
    })
  );

  const soundButton = el("button", {
    class: progress.settings.soundOn ? "chip is-on" : "chip",
    text: progress.settings.soundOn ? "おと：オン" : "おと：オフ",
    onClick: () => {
      const next = !ctx.getProgress().settings.soundOn;
      ctx.update((p) => setSoundOn(p, next));
      ctx.audio.setEnabled(next);
      if (next) ctx.audio.sfx("correct");
      ctx.navigate({ name: "menu" });
    }
  });

  const screen = el("div", { class: "screen menu-screen" }, [
    el("div", { class: "title", text: "せんごく タイピング" }),
    el("div", { class: "title-emoji", text: "🏯⚔️🐎🥷🔥" }),
    el("div", { class: "menu-buttons" }, [
      el("button", { class: "big-button", text: "🖐 ゆびの たいそう", onClick: () => ctx.navigate({ name: "warmup" }) }),
      el("button", {
        class: "big-button primary",
        text: "⚔️ せんごくの ことばを あつめる",
        onClick: () => ctx.navigate({ name: "worldmap" })
      }),
      el("button", { class: "big-button", text: "📖 ことば ずかん", onClick: () => ctx.navigate({ name: "zukan" }) })
    ]),
    el("div", { class: "settings" }, [
      el("div", { class: "settings-row" }, [el("span", { class: "settings-label", text: "おたすけ：" }), ...assistButtons]),
      el("div", { class: "settings-row" }, [el("span", { class: "settings-label", text: "せってい：" }), soundButton])
    ])
  ]);

  ctx.root.replaceChildren(screen);
  return () => {};
}
