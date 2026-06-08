// テーマ（あつめるコレクション）の登録所。今は「せんごく」「にほんし」「にほんぶんか」の3つ。
// 各画面（gameScreen/zukanScreen/worldMapScreen）は Collection を受け取り、
// どのテーマでも同じ収集ループで動く。汎用テーマ機構ではなく、この3つ分だけの最小パラメータ化。

import type { GameWord } from "./words";
import { WORDS, wordsByWorld as sengokuWordsByWorld } from "./words";
import type { World } from "./worlds";
import { WORLDS } from "./worlds";
import { HISTORY_WORDS, HISTORY_WORLDS } from "./history";
import { CULTURE_WORDS, CULTURE_WORLDS } from "./culture";

export type ThemeKey = "sengoku" | "nihonshi" | "nihonbunka";

// ずかん詳細の見出し（テーマで言い回しを変える）。[絵文字, ラベル] の組。
export interface DetailLabels {
  life: [string, string]; // 生没年 / いつ
  place: [string, string]; // 領国 / ばしょ・時代
  deed: [string, string]; // 有名な戦い / やったこと・できごと
  trivia: [string, string]; // 豆知識
}

export interface Collection {
  key: ThemeKey;
  title: string; // worldmap ヘッダの見出し
  zukanTitle: string; // ずかんヘッダの見出し
  completeMessage: string; // 最終ステージクリア時のメッセージ
  worlds: World[];
  firstWorldId: number; // 入口として常に解放するワールド
  allEntries: GameWord[]; // ずかんの総数カウント用
  wordsByWorld(worldId: number): GameWord[];
  getWorld(id: number): World;
  nextWorldId(id: number): number | null; // クリア時に次へ解放する
  detailLabels: DetailLabels;
}

// 与えられたワールド一覧から id で探す（見つからなければエラー＝サイレントフォールバックしない）。
function findWorld(worlds: World[], id: number): World {
  const world = worlds.find((candidate) => candidate.id === id);
  if (!world) {
    console.error("[typing:collections] Unknown world", { id });
    throw new Error(`Unknown world: ${id}`);
  }
  return world;
}

// order が1つ大きいワールドを返す（最後なら null）。
function findNextWorldId(worlds: World[], id: number): number | null {
  const current = findWorld(worlds, id);
  const next = worlds.find((candidate) => candidate.order === current.order + 1);
  return next?.id ?? null;
}

const sengoku: Collection = {
  key: "sengoku",
  title: "せんごく ステージ",
  zukanTitle: "せんごく ずかん",
  completeMessage: "ぜんぶ あつめたね！てんかとういつ！",
  worlds: WORLDS,
  firstWorldId: 1,
  allEntries: WORDS,
  wordsByWorld: sengokuWordsByWorld, // 文字数で4ステージに自動配分（既存ロジック）
  getWorld: (id) => findWorld(WORLDS, id),
  nextWorldId: (id) => findNextWorldId(WORLDS, id),
  detailLabels: {
    life: ["🗓", "生まれ〜没"],
    place: ["🏯", "領国"],
    deed: ["⚔️", "有名な戦い・できごと"],
    trivia: ["💡", "豆知識"]
  }
};

const nihonshi: Collection = {
  key: "nihonshi",
  title: "にほんし ステージ",
  zukanTitle: "にほんし ずかん",
  completeMessage: "ぜんぶ あつめたね！れきし はかせ だ！",
  worlds: HISTORY_WORLDS,
  firstWorldId: 11,
  allEntries: HISTORY_WORDS,
  wordsByWorld: (worldId) => HISTORY_WORDS.filter((entry) => entry.worldId === worldId), // 時代ごとに明示割当
  getWorld: (id) => findWorld(HISTORY_WORLDS, id),
  nextWorldId: (id) => findNextWorldId(HISTORY_WORLDS, id),
  detailLabels: {
    life: ["🗓", "いつ"],
    place: ["📍", "ばしょ・時代"],
    deed: ["✨", "やったこと・できごと"],
    trivia: ["💡", "豆知識"]
  }
};

const nihonbunka: Collection = {
  key: "nihonbunka",
  title: "にほんぶんか ステージ",
  zukanTitle: "にほんぶんか ずかん",
  completeMessage: "ぜんぶ あつめたね！ぶんか はかせ だ！",
  worlds: CULTURE_WORLDS,
  firstWorldId: 21,
  allEntries: CULTURE_WORDS,
  wordsByWorld: (worldId) => CULTURE_WORDS.filter((entry) => entry.worldId === worldId), // ジャンルごとに明示割当
  getWorld: (id) => findWorld(CULTURE_WORLDS, id),
  nextWorldId: (id) => findNextWorldId(CULTURE_WORLDS, id),
  detailLabels: {
    life: ["🗓", "時代"],
    place: ["📍", "ばしょ"],
    deed: ["👀", "見どころ"],
    trivia: ["💡", "豆知識"]
  }
};

export const COLLECTIONS: Record<ThemeKey, Collection> = { sengoku, nihonshi, nihonbunka };

export function getCollection(key: ThemeKey): Collection {
  const collection = COLLECTIONS[key];
  if (!collection) {
    console.error("[typing:collections] Unknown theme", { key });
    throw new Error(`Unknown theme: ${key}`);
  }
  console.debug("[typing:collections] getCollection", { key });
  return collection;
}
