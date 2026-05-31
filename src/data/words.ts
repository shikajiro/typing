// 戦国ことば＝打つローマ字＋集める対象。武将・武具・用語をまぜる。
// id は word（ローマ字）と同じ（一意）。語長でワールドに割り当て、やさしい順に並べる。
// name は漢字、reading はふりがな（ひらがな）、emoji はシンボル。

export interface GameWord {
  id: string;
  word: string;
  name: string;
  reading: string;
  emoji: string;
  worldId: number;
}

export const WORDS: GameWord[] = [
  // World 1「あしがるの むら」: みじかい戦国ことば（3〜5もじ）
  { id: "uma", word: "uma", name: "馬", reading: "うま", emoji: "🐎", worldId: 1 },
  { id: "oda", word: "oda", name: "織田", reading: "おだ", emoji: "🔥", worldId: 1 },
  { id: "hata", word: "hata", name: "旗", reading: "はた", emoji: "🚩", worldId: 1 },
  { id: "tate", word: "tate", name: "盾", reading: "たて", emoji: "🛡️", worldId: 1 },
  { id: "yari", word: "yari", name: "槍", reading: "やり", emoji: "🗡️", worldId: 1 },
  { id: "yumi", word: "yumi", name: "弓", reading: "ゆみ", emoji: "🏹", worldId: 1 },
  { id: "date", word: "date", name: "伊達", reading: "だて", emoji: "🌙", worldId: 1 },
  { id: "shiro", word: "shiro", name: "城", reading: "しろ", emoji: "🏯", worldId: 1 },

  // World 2「ぶしょうの しろ」: 武具と武将（5〜7もじ）
  { id: "ninja", word: "ninja", name: "忍者", reading: "にんじゃ", emoji: "🥷", worldId: 2 },
  { id: "yoroi", word: "yoroi", name: "鎧", reading: "よろい", emoji: "🥋", worldId: 2 },
  { id: "teppo", word: "teppo", name: "鉄砲", reading: "てっぽう", emoji: "🔫", worldId: 2 },
  { id: "kabuto", word: "kabuto", name: "兜", reading: "かぶと", emoji: "🪖", worldId: 2 },
  { id: "katana", word: "katana", name: "刀", reading: "かたな", emoji: "⚔️", worldId: 2 },
  { id: "takeda", word: "takeda", name: "武田", reading: "たけだ", emoji: "🐎", worldId: 2 },
  { id: "uesugi", word: "uesugi", name: "上杉", reading: "うえすぎ", emoji: "❄️", worldId: 2 },
  { id: "samurai", word: "samurai", name: "侍", reading: "さむらい", emoji: "🗡️", worldId: 2 },

  // World 3「てんかの いくさ」: 長い名前と用語（7もじ以上）
  { id: "sengoku", word: "sengoku", name: "戦国", reading: "せんごく", emoji: "🏯", worldId: 3 },
  { id: "bushido", word: "bushido", name: "武士道", reading: "ぶしどう", emoji: "🎌", worldId: 3 },
  { id: "nobunaga", word: "nobunaga", name: "信長", reading: "のぶなが", emoji: "🔥", worldId: 3 },
  { id: "masamune", word: "masamune", name: "政宗", reading: "まさむね", emoji: "🌙", worldId: 3 },
  { id: "yukimura", word: "yukimura", name: "幸村", reading: "ゆきむら", emoji: "🦌", worldId: 3 },
  { id: "tokugawa", word: "tokugawa", name: "徳川", reading: "とくがわ", emoji: "🌿", worldId: 3 },
  { id: "mitsuhide", word: "mitsuhide", name: "光秀", reading: "みつひで", emoji: "🟣", worldId: 3 },
  { id: "hideyoshi", word: "hideyoshi", name: "秀吉", reading: "ひでよし", emoji: "🌅", worldId: 3 }
];

export function getWord(id: string): GameWord {
  const found = WORDS.find((candidate) => candidate.id === id);
  if (!found) {
    console.error("[typing:words] Unknown word", { id });
    throw new Error(`Unknown word: ${id}`);
  }
  return found;
}

export function wordsByWorld(worldId: number): GameWord[] {
  return WORDS.filter((entry) => entry.worldId === worldId);
}

export function worldWordIds(worldId: number): string[] {
  return wordsByWorld(worldId).map((entry) => entry.id);
}
