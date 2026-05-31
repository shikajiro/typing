// ずかん。あつめたどうぶつは絵と名前が見える。まだのこは「？？？」。

import { animalsByWorld } from "../data/animals";
import { WORLDS } from "../data/worlds";
import { el } from "./dom";
import type { AppContext } from "./types";

export function renderZukanScreen(ctx: AppContext): () => void {
  const progress = ctx.getProgress();

  const sections = WORLDS.flatMap((world) => {
    const cells = animalsByWorld(world.id).map((animal) => {
      const collected = progress.collectedAnimalIds.includes(animal.id);
      if (!collected) {
        return el("div", { class: "zukan-cell is-unknown" }, [
          el("div", { class: "zukan-emoji", text: "❓" }),
          el("div", { class: "zukan-name", text: "？？？" })
        ]);
      }
      return el("div", { class: "zukan-cell" }, [
        el("div", { class: "zukan-emoji", text: animal.emoji }),
        el("div", { class: "zukan-name", text: animal.word.toUpperCase() }),
        el("div", { class: "zukan-kana", text: animal.kana })
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
      el("div", { class: "count", text: `${progress.collectedAnimalIds.length}` })
    ]),
    el("div", { class: "zukan-body" }, sections)
  ]);

  ctx.root.replaceChildren(screen);
  return () => {};
}
