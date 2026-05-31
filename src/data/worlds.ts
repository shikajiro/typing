// ワールド（ステージ）。武将は「ローマ字の文字数の順位」で 4 ステージに均等配分される（words.ts）。
// 短いフルネーム→長いフルネームへ、やさしい順。

export interface World {
  id: number;
  name: string;
  order: number;
}

export const WORLDS: World[] = [
  { id: 1, name: "はじまりの いくさ", order: 1 },
  { id: 2, name: "くにとり がっせん", order: 2 },
  { id: 3, name: "てんかわけめの たたかい", order: 3 },
  { id: 4, name: "せんごく さいきょうでん", order: 4 }
];

export function getWorld(id: number): World {
  const world = WORLDS.find((candidate) => candidate.id === id);
  if (!world) {
    console.error("[typing:worlds] Unknown world", { id });
    throw new Error(`Unknown world: ${id}`);
  }
  return world;
}

export function nextWorldId(id: number): number | null {
  const current = getWorld(id);
  const next = WORLDS.find((candidate) => candidate.order === current.order + 1);
  return next?.id ?? null;
}
