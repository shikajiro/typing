// 戦国ことば＝打つローマ字＋集める対象。戦国大名・武将・武具・用語をまぜる。
// id は word（ローマ字）と同じ（一意）。ローマ字は簡易ヘボン式（a-z、長音は省略）。
// name は漢字、reading はふりがな（ひらがな）、emoji はシンボル。
// 読みは Wikipedia「戦国大名」より裏取り。語長でワールド（ステージ）に割り当て、やさしい順に並べる。

export interface GameWord {
  id: string;
  word: string;
  name: string;
  reading: string;
  emoji: string;
  worldId: number;
}

export const WORDS: GameWord[] = [
  // ── World 1「あしがるの むら」: 3〜4もじ ──
  { id: "uma", word: "uma", name: "馬", reading: "うま", emoji: "🐎", worldId: 1 },
  { id: "oda", word: "oda", name: "織田", reading: "おだ", emoji: "🔥", worldId: 1 },
  { id: "ito", word: "ito", name: "伊東", reading: "いとう", emoji: "⚔️", worldId: 1 },
  { id: "mori", word: "mori", name: "毛利", reading: "もうり", emoji: "⭐", worldId: 1 },
  { id: "date", word: "date", name: "伊達", reading: "だて", emoji: "🌙", worldId: 1 },
  { id: "hojo", word: "hojo", name: "北条", reading: "ほうじょう", emoji: "🔺", worldId: 1 },
  { id: "yari", word: "yari", name: "槍", reading: "やり", emoji: "🗡️", worldId: 1 },
  { id: "hata", word: "hata", name: "旗", reading: "はた", emoji: "🚩", worldId: 1 },
  { id: "soma", word: "soma", name: "相馬", reading: "そうま", emoji: "🐴", worldId: 1 },
  { id: "yuki", word: "yuki", name: "結城", reading: "ゆうき", emoji: "🎴", worldId: 1 },
  { id: "nasu", word: "nasu", name: "那須", reading: "なす", emoji: "🏹", worldId: 1 },
  { id: "soun", word: "soun", name: "早雲", reading: "そううん", emoji: "☁️", worldId: 1 },

  // ── World 2「ぶしょうの やかた」: 5もじ ──
  { id: "shiro", word: "shiro", name: "城", reading: "しろ", emoji: "🏯", worldId: 2 },
  { id: "ninja", word: "ninja", name: "忍者", reading: "にんじゃ", emoji: "🥷", worldId: 2 },
  { id: "yoroi", word: "yoroi", name: "鎧", reading: "よろい", emoji: "🥋", worldId: 2 },
  { id: "nanbu", word: "nanbu", name: "南部", reading: "なんぶ", emoji: "🏔️", worldId: 2 },
  { id: "ukita", word: "ukita", name: "宇喜多", reading: "うきた", emoji: "🌖", worldId: 2 },
  { id: "nagao", word: "nagao", name: "長尾", reading: "ながお", emoji: "🐉", worldId: 2 },
  { id: "otomo", word: "otomo", name: "大友", reading: "おおとも", emoji: "⛪", worldId: 2 },
  { id: "ouchi", word: "ouchi", name: "大内", reading: "おおうち", emoji: "🎎", worldId: 2 },
  { id: "naito", word: "naito", name: "内藤", reading: "ないとう", emoji: "🛡️", worldId: 2 },
  { id: "dosan", word: "dosan", name: "道三", reading: "どうさん", emoji: "🐍", worldId: 2 },
  { id: "arima", word: "arima", name: "有馬", reading: "ありま", emoji: "🌸", worldId: 2 },
  { id: "omura", word: "omura", name: "大村", reading: "おおむら", emoji: "🌷", worldId: 2 },

  // ── World 3「おおきな しろ」: 6もじ ──
  { id: "takeda", word: "takeda", name: "武田", reading: "たけだ", emoji: "🐎", worldId: 3 },
  { id: "uesugi", word: "uesugi", name: "上杉", reading: "うえすぎ", emoji: "❄️", worldId: 3 },
  { id: "sanada", word: "sanada", name: "真田", reading: "さなだ", emoji: "🦌", worldId: 3 },
  { id: "kabuto", word: "kabuto", name: "兜", reading: "かぶと", emoji: "🪖", worldId: 3 },
  { id: "katana", word: "katana", name: "刀", reading: "かたな", emoji: "⚔️", worldId: 3 },
  { id: "ieyasu", word: "ieyasu", name: "家康", reading: "いえやす", emoji: "☘️", worldId: 3 },
  { id: "akechi", word: "akechi", name: "明智", reading: "あけち", emoji: "🟣", worldId: 3 },
  { id: "satake", word: "satake", name: "佐竹", reading: "さたけ", emoji: "🎍", worldId: 3 },
  { id: "satomi", word: "satomi", name: "里見", reading: "さとみ", emoji: "🐕", worldId: 3 },
  { id: "mogami", word: "mogami", name: "最上", reading: "もがみ", emoji: "🌾", worldId: 3 },
  { id: "yamana", word: "yamana", name: "山名", reading: "やまな", emoji: "⛰️", worldId: 3 },
  { id: "sagara", word: "sagara", name: "相良", reading: "さがら", emoji: "🍵", worldId: 3 },

  // ── World 4「がっせんの の」: 7もじ ──
  { id: "shimazu", word: "shimazu", name: "島津", reading: "しまづ", emoji: "➕", worldId: 4 },
  { id: "samurai", word: "samurai", name: "侍", reading: "さむらい", emoji: "🗡️", worldId: 4 },
  { id: "sengoku", word: "sengoku", name: "戦国", reading: "せんごく", emoji: "🏯", worldId: 4 },
  { id: "bushido", word: "bushido", name: "武士道", reading: "ぶしどう", emoji: "🎌", worldId: 4 },
  { id: "shingen", word: "shingen", name: "信玄", reading: "しんげん", emoji: "🔥", worldId: 4 },
  { id: "kenshin", word: "kenshin", name: "謙信", reading: "けんしん", emoji: "⚔️", worldId: 4 },
  { id: "imagawa", word: "imagawa", name: "今川", reading: "いまがわ", emoji: "🎏", worldId: 4 },
  { id: "asakura", word: "asakura", name: "朝倉", reading: "あさくら", emoji: "🌸", worldId: 4 },
  { id: "kyogoku", word: "kyogoku", name: "京極", reading: "きょうごく", emoji: "⛩️", worldId: 4 },
  { id: "ryuzoji", word: "ryuzoji", name: "龍造寺", reading: "りゅうぞうじ", emoji: "🐉", worldId: 4 },
  { id: "tsutsui", word: "tsutsui", name: "筒井", reading: "つつい", emoji: "🥁", worldId: 4 },
  { id: "akizuki", word: "akizuki", name: "秋月", reading: "あきづき", emoji: "🌕", worldId: 4 },

  // ── World 5「てんかの みち」: 8もじ いじょう ──
  { id: "nobunaga", word: "nobunaga", name: "信長", reading: "のぶなが", emoji: "🔥", worldId: 5 },
  { id: "hideyoshi", word: "hideyoshi", name: "秀吉", reading: "ひでよし", emoji: "🌅", worldId: 5 },
  { id: "masamune", word: "masamune", name: "政宗", reading: "まさむね", emoji: "🌙", worldId: 5 },
  { id: "yukimura", word: "yukimura", name: "幸村", reading: "ゆきむら", emoji: "🦌", worldId: 5 },
  { id: "tokugawa", word: "tokugawa", name: "徳川", reading: "とくがわ", emoji: "🌿", worldId: 5 },
  { id: "mitsuhide", word: "mitsuhide", name: "光秀", reading: "みつひで", emoji: "🟣", worldId: 5 },
  { id: "mitsunari", word: "mitsunari", name: "三成", reading: "みつなり", emoji: "⚖️", worldId: 5 },
  { id: "motonari", word: "motonari", name: "元就", reading: "もとなり", emoji: "⭐", worldId: 5 },
  { id: "hosokawa", word: "hosokawa", name: "細川", reading: "ほそかわ", emoji: "🎴", worldId: 5 },
  { id: "tachibana", word: "tachibana", name: "立花", reading: "たちばな", emoji: "🌼", worldId: 5 },
  { id: "kanetsugu", word: "kanetsugu", name: "兼続", reading: "かねつぐ", emoji: "❤️", worldId: 5 },
  { id: "chosokabe", word: "chosokabe", name: "長宗我部", reading: "ちょうそかべ", emoji: "🌊", worldId: 5 }
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
