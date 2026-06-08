// ステージ選択。あいているステージはあそべる、まだのステージはカギ付き。
// あつかうテーマ（せんごく／にほんし／にほんぶんか）は collection で受け取る。

import { isWorldUnlocked } from "../core/progress";
import type { Collection } from "../data/collections";
import { el } from "./dom";
import type { AppContext } from "./types";

export function renderWorldMapScreen(ctx: AppContext, collection: Collection): () => void {
  const progress = ctx.getProgress();

  const cards = collection.worlds.map((world) => {
    const ids = collection.wordsByWorld(world.id).map((entry) => entry.id);
    const collected = ids.filter((id) => progress.collectedIds.includes(id)).length;
    // 各テーマの先頭ワールドは入口として常に解放（既存セーブの移行が不要）。
    const unlocked = world.id === collection.firstWorldId || isWorldUnlocked(progress, world.id);

    if (!unlocked) {
      return el("div", { class: "world-card is-locked" }, [
        el("div", { class: "world-card-emoji", text: "🔒" }),
        el("div", { class: "world-card-name", text: world.name }),
        el("div", { class: "world-card-sub", text: "まだ あそべないよ" })
      ]);
    }

    return el(
      "button",
      { class: "world-card", onClick: () => ctx.navigate({ name: "game", theme: collection.key, worldId: world.id }) },
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
      el("div", { class: "world-name", text: collection.title }),
      el("div", { class: "count" })
    ]),
    el("div", { class: "world-list" }, cards)
  ]);

  ctx.root.replaceChildren(screen);
  return () => {};
}
