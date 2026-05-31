// ずかん。あつめた戦国ことばは絵と名前が見える。まだのものは「？？？」。

import { romajiOf, wordsByWorld } from "../data/words";
import { WORLDS } from "../data/worlds";
import { el, renderRuby, ruby } from "./dom";
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
      let head: HTMLElement;
      if (entry.image) {
        head = el("img", { class: "zukan-portrait" });
        (head as HTMLImageElement).src = entry.image;
      } else {
        head = el("div", { class: "zukan-emoji", text: entry.emoji });
      }
      return el("div", { class: "zukan-cell" }, [
        head,
        el("div", { class: "zukan-name" }, [ruby(entry.name, entry.reading)]),
        el("div", { class: "zukan-kana", text: romajiOf(entry).toUpperCase() }),
        el("div", { class: "zukan-desc" }, renderRuby(entry.description))
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
