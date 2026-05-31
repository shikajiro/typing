// ステージ選択。あいているステージはあそべる、まだのステージはカギ付き。

import { isWorldUnlocked } from "../core/progress";
import { worldWordIds } from "../data/words";
import { WORLDS } from "../data/worlds";
import { el } from "./dom";
import type { AppContext } from "./types";

export function renderWorldMapScreen(ctx: AppContext): () => void {
  const progress = ctx.getProgress();

  const cards = WORLDS.map((world) => {
    const ids = worldWordIds(world.id);
    const collected = ids.filter((id) => progress.collectedIds.includes(id)).length;
    const unlocked = isWorldUnlocked(progress, world.id);

    if (!unlocked) {
      return el("div", { class: "world-card is-locked" }, [
        el("div", { class: "world-card-emoji", text: "🔒" }),
        el("div", { class: "world-card-name", text: world.name }),
        el("div", { class: "world-card-sub", text: "まだ あそべないよ" })
      ]);
    }

    return el(
      "button",
      { class: "world-card", onClick: () => ctx.navigate({ name: "game", worldId: world.id }) },
      [
        el("div", { class: "world-card-emoji", text: collected === ids.length ? "🏆" : "🏯" }),
        el("div", { class: "world-card-name", text: world.name }),
        el("div", { class: "world-card-sub", text: `${collected}/${ids.length} あつめた` })
      ]
    );
  });

  const screen = el("div", { class: "screen worldmap-screen" }, [
    el("header", { class: "topbar" }, [
      el("button", { class: "back-button", text: "← もどる", onClick: () => ctx.navigate({ name: "menu" }) }),
      el("div", { class: "world-name", text: "せんごく ステージ" }),
      el("div", { class: "count" })
    ]),
    el("div", { class: "world-list" }, cards)
  ]);

  ctx.root.replaceChildren(screen);
  return () => {};
}
