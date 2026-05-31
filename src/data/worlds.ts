// ワールド（ステージ）。武将フルネームのローマ字の「文字数」でやさしい順に分ける。
// 各武将の所属ステージは worldId を手で振らず、文字数の範囲(minLen..maxLen)から自動で決まる。

export interface World {
  id: number;
  name: string;
  order: number;
  minLen: number;
  maxLen: number;
}

export const WORLDS: World[] = [
  { id: 1, name: "はじまりの いくさ", order: 1, minLen: 0, maxLen: 11 },
  { id: 2, name: "くにとり がっせん", order: 2, minLen: 12, maxLen: 13 },
  { id: 3, name: "てんかわけめの たたかい", order: 3, minLen: 14, maxLen: 15 },
  { id: 4, name: "せんごく さいきょうでん", order: 4, minLen: 16, maxLen: 999 }
];

export function getWorld(id: number): World {
  const world = WORLDS.find((candidate) => candidate.id === id);
  if (!world) {
    console.error("[typing:worlds] Unknown world", { id });
    throw new Error(`Unknown world: ${id}`);
  }
  return world;
}

export function worldForLength(length: number): World {
  const world = WORLDS.find((candidate) => length >= candidate.minLen && length <= candidate.maxLen);
  if (!world) {
    console.error("[typing:worlds] No world covers length", { length });
    throw new Error(`No world covers length: ${length}`);
  }
  return world;
}

export function nextWorldId(id: number): number | null {
  const current = getWorld(id);
  const next = WORLDS.find((candidate) => candidate.order === current.order + 1);
  return next?.id ?? null;
}
