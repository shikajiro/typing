// どうぶつ＝打つ英単語。id は word と同じ（単語は一意）。
// 語長でワールドに割り当て（W1=3文字, W2=4文字, W3=5文字以上）。

export interface Animal {
  id: string;
  word: string;
  kana: string;
  emoji: string;
  worldId: number;
}

export const ANIMALS: Animal[] = [
  // World 1: 3 もじ
  { id: "cat", word: "cat", kana: "キャット", emoji: "🐱", worldId: 1 },
  { id: "dog", word: "dog", kana: "ドッグ", emoji: "🐶", worldId: 1 },
  { id: "pig", word: "pig", kana: "ピッグ", emoji: "🐷", worldId: 1 },
  { id: "cow", word: "cow", kana: "カウ", emoji: "🐮", worldId: 1 },
  { id: "hen", word: "hen", kana: "ヘン", emoji: "🐔", worldId: 1 },
  { id: "fox", word: "fox", kana: "フォックス", emoji: "🦊", worldId: 1 },
  { id: "ant", word: "ant", kana: "アント", emoji: "🐜", worldId: 1 },
  { id: "bee", word: "bee", kana: "ビー", emoji: "🐝", worldId: 1 },

  // World 2: 4 もじ
  { id: "lion", word: "lion", kana: "ライオン", emoji: "🦁", worldId: 2 },
  { id: "bear", word: "bear", kana: "ベア", emoji: "🐻", worldId: 2 },
  { id: "frog", word: "frog", kana: "フロッグ", emoji: "🐸", worldId: 2 },
  { id: "fish", word: "fish", kana: "フィッシュ", emoji: "🐟", worldId: 2 },
  { id: "bird", word: "bird", kana: "バード", emoji: "🐦", worldId: 2 },
  { id: "duck", word: "duck", kana: "ダック", emoji: "🦆", worldId: 2 },
  { id: "goat", word: "goat", kana: "ゴート", emoji: "🐐", worldId: 2 },
  { id: "wolf", word: "wolf", kana: "ウルフ", emoji: "🐺", worldId: 2 },

  // World 3: 5 もじ いじょう
  { id: "tiger", word: "tiger", kana: "タイガー", emoji: "🐯", worldId: 3 },
  { id: "horse", word: "horse", kana: "ホース", emoji: "🐴", worldId: 3 },
  { id: "sheep", word: "sheep", kana: "シープ", emoji: "🐑", worldId: 3 },
  { id: "mouse", word: "mouse", kana: "マウス", emoji: "🐭", worldId: 3 },
  { id: "zebra", word: "zebra", kana: "ゼブラ", emoji: "🦓", worldId: 3 },
  { id: "panda", word: "panda", kana: "パンダ", emoji: "🐼", worldId: 3 },
  { id: "snake", word: "snake", kana: "スネーク", emoji: "🐍", worldId: 3 },
  { id: "whale", word: "whale", kana: "ホエール", emoji: "🐳", worldId: 3 }
];

export function getAnimal(id: string): Animal {
  const animal = ANIMALS.find((candidate) => candidate.id === id);
  if (!animal) {
    console.error("[typing:animals] Unknown animal", { id });
    throw new Error(`Unknown animal: ${id}`);
  }
  return animal;
}

export function animalsByWorld(worldId: number): Animal[] {
  return ANIMALS.filter((animal) => animal.worldId === worldId);
}

export function worldAnimalIds(worldId: number): string[] {
  return animalsByWorld(worldId).map((animal) => animal.id);
}
