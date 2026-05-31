// ワールド（れんしゅうコース）。戦国の舞台を語長でやさしい順に並べる。

export interface World {
  id: number;
  name: string;
  order: number;
}

export const WORLDS: World[] = [
  { id: 1, name: "あしがるの むら", order: 1 },
  { id: 2, name: "ぶしょうの しろ", order: 2 },
  { id: 3, name: "てんかの いくさ", order: 3 }
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
