// ずかん。あつめたことばは絵と名前が見える。まだのものは「？？？」。
// あつめた人物/できごとをクリック/Enter すると、その詳細モーダルを開く。
// あつかうテーマ（せんごく／にほんし／にほんぶんか）は collection で受け取り、見出しもテーマで切り替える。

import type { Collection } from "../data/collections";
import { romajiOf, type GameWord } from "../data/words";
import { el, renderRuby, ruby } from "./dom";
import type { AppContext } from "./types";

function kindTagText(entry: GameWord): string {
  if (entry.kind === "event") return "📜 できごと";
  if (entry.kind === "culture") return "🏛️ 文化財";
  return "";
}

export function renderZukanScreen(ctx: AppContext, collection: Collection): () => void {
  const progress = ctx.getProgress();
  const labels = collection.detailLabels;

  let overlay: HTMLElement | null = null;
  let lastFocused: HTMLElement | null = null;

  function onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") closeDetail();
  }

  function closeDetail(): void {
    if (!overlay) return;
    console.debug("[typing:zukan] closeDetail");
    overlay.remove();
    overlay = null;
    window.removeEventListener("keydown", onOverlayKeydown);
    if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  // ラベル付きの1項目。body は renderRuby の結果（ふりがな付きノード列）。
  function detailRow(emoji: string, label: string, body: Array<HTMLElement | Text>): HTMLElement {
    return el("div", { class: "detail-row" }, [
      el("div", { class: "detail-label", text: `${emoji} ${label}` }),
      el("div", { class: "detail-value" }, body)
    ]);
  }

  function openDetail(entry: GameWord, trigger: HTMLElement): void {
    console.debug("[typing:zukan] openDetail", { id: entry.id });
    closeDetail(); // 二重表示を防ぐ
    lastFocused = trigger;

    let head: HTMLElement;
    if (entry.image) {
      head = el("img", { class: "detail-portrait" });
      (head as HTMLImageElement).src = entry.image;
      (head as HTMLImageElement).alt = entry.name;
    } else {
      head = el("div", { class: "detail-emoji", text: entry.emoji });
    }

    const closeBtn = el("button", { class: "detail-close", text: "✕", onClick: closeDetail });
    closeBtn.setAttribute("aria-label", "とじる");

    const rows: HTMLElement[] = [];
    if (entry.life) rows.push(detailRow(labels.life[0], labels.life[1], renderRuby(entry.life)));
    if (entry.domain) rows.push(detailRow(labels.place[0], labels.place[1], renderRuby(entry.domain)));
    if (entry.battles) rows.push(detailRow(labels.deed[0], labels.deed[1], renderRuby(entry.battles)));
    if (entry.trivia) rows.push(detailRow(labels.trivia[0], labels.trivia[1], renderRuby(entry.trivia)));

    const cardChildren: Array<HTMLElement> = [closeBtn, head];
    const kindText = kindTagText(entry);
    if (kindText) cardChildren.push(el("div", { class: "kind-tag", text: kindText }));
    cardChildren.push(
      el("div", { class: "detail-name" }, [ruby(entry.name, entry.reading)]),
      el("div", { class: "detail-kana", text: romajiOf(entry).toUpperCase() }),
      el("button", {
        class: "listen-button",
        text: "🔊 きいてみる",
        onClick: () => ctx.audio.speak(entry.reading)
      }),
      el("div", { class: "detail-rows" }, rows),
      el("div", { class: "detail-desc" }, renderRuby(entry.description))
    );

    const card = el("div", { class: "zukan-detail-card" }, cardChildren);
    // カード内クリックでは閉じない（背景クリックだけ閉じる）。
    card.addEventListener("click", (event) => event.stopPropagation());

    overlay = el("div", { class: "zukan-detail-overlay", onClick: closeDetail }, [card]);
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    screen.append(overlay);
    window.addEventListener("keydown", onOverlayKeydown);
    closeBtn.focus();
  }

  const sections = collection.worlds.flatMap((world) => {
    const cells = collection.wordsByWorld(world.id).map((entry) => {
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
      const cellChildren: Array<HTMLElement> = [head];
      const kindText = kindTagText(entry);
      if (kindText) cellChildren.push(el("div", { class: "kind-tag", text: kindText }));
      cellChildren.push(
        el("div", { class: "zukan-name" }, [ruby(entry.name, entry.reading)]),
        el("div", { class: "zukan-kana", text: romajiOf(entry).toUpperCase() }),
        el("div", { class: "zukan-desc" }, renderRuby(entry.description))
      );
      const cell = el("div", { class: "zukan-cell is-clickable" }, cellChildren);
      // 取得済みセルはクリック/キーボードで詳細を開く。
      cell.setAttribute("role", "button");
      cell.tabIndex = 0;
      cell.addEventListener("click", () => openDetail(entry, cell));
      cell.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetail(entry, cell);
        }
      });
      return cell;
    });

    return [
      el("div", { class: "zukan-section-title", text: world.name }),
      el("div", { class: "zukan-grid" }, cells)
    ];
  });

  const collectedCount = collection.allEntries.filter((entry) => progress.collectedIds.includes(entry.id)).length;
  const screen = el("div", { class: "screen zukan-screen" }, [
    el("header", { class: "topbar" }, [
      el("button", { class: "back-button", text: "← もどる", onClick: () => ctx.navigate({ name: "menu" }) }),
      el("div", { class: "world-name", text: collection.zukanTitle }),
      el("div", { class: "count", text: `${collectedCount}` })
    ]),
    el("div", { class: "zukan-body" }, sections)
  ]);

  ctx.root.replaceChildren(screen);
  return () => {
    window.removeEventListener("keydown", onOverlayKeydown);
  };
}
