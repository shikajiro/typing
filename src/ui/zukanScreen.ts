// ずかん。あつめた戦国ことばは絵と名前が見える。まだのものは「？？？」。

import { wordsByWorld } from "../data/words";
import { WORLDS } from "../data/worlds";
import { el, ruby } from "./dom";
import type { AppContext } from "./types";

export function renderZukanScreen(ctx: AppContext): () => void {
  const progress = ctx.getProgress();

  const sections = WORLDS.flatMap((world) => {
    const cells = wordsByWorld(world.id).map((entry) => {
      const collected = progress.collectedIds.includes(entry.id);
      if (!collected) {
        return el("div", { class: "zukan-cell is-unknown" }, [
          el("div", { class: "zukan-emoji", text: "❓" }),
          el("div", { class: "zukan-name", text: "？？？" })
        ]);
      }
      return el("div", { class: "zukan-cell" }, [
        el("div", { class: "zukan-emoji", text: entry.emoji }),
        el("div", { class: "zukan-name" }, [ruby(entry.name, entry.reading)]),
        el("div", { class: "zukan-kana", text: entry.word.toUpperCase() })
      ]);
    });

    return [
      el("div", { class: "zukan-section-title", text: world.name }),
      el("div", { class: "zukan-grid" }, cells)
    ];
  });

  const screen = el("div", { class: "screen zukan-screen" }, [
    el("header", { class: "topbar" }, [
      el("button", { class: "back-button", text: "← もどる", onClick: () => ctx.navigate({ name: "menu" }) }),
      el("div", { class: "world-name", text: "ずかん" }),
      el("div", { class: "count", text: `${progress.collectedIds.length}` })
    ]),
    el("div", { class: "zukan-body" }, sections)
  ]);

  ctx.root.replaceChildren(screen);
  return () => {};
}
