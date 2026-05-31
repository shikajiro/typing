// 戦国武将＝打つローマ字（フルネーム）＋集める対象。
// id は word（ローマ字）と同じ（一意）。ローマ字は簡易ヘボン式（a-z、長音は省略）。
// name は漢字フルネーム、reading はふりがな（ひらがな）、emoji はシンボル、description はやさしい解説。
// 名前・読みは Wikipedia「戦国大名」「各武将記事」を参考。所属ステージは worlds.ts が文字数から自動算出。

import { worldForLength } from "./worlds";

export interface GameWord {
  id: string;
  word: string;
  name: string;
  reading: string;
  emoji: string;
  description: string;
}

export const WORDS: GameWord[] = [
  { id: "hojosoun", word: "hojosoun", name: "北条早雲", reading: "ほうじょうそううん", emoji: "🔺", description: "せんごくだいみょうの さきがけ" },
  { id: "iinaomasa", word: "iinaomasa", name: "井伊直政", reading: "いいなおまさ", emoji: "🔴", description: "とくがわの あかぞなえの たいしょう" },
  { id: "saitodosan", word: "saitodosan", name: "斎藤道三", reading: "さいとうどうさん", emoji: "🐍", description: "まむしと よばれた みのの ぶしょう" },
  { id: "otomosorin", word: "otomosorin", name: "大友宗麟", reading: "おおともそうりん", emoji: "⛪", description: "きゅうしゅうの キリシタンだいみょう" },
  { id: "maedakeiji", word: "maedakeiji", name: "前田慶次", reading: "まえだけいじ", emoji: "🌪️", description: "ゆうめいな かぶきもの" },
  { id: "shimasakon", word: "shimasakon", name: "島左近", reading: "しまさこん", emoji: "⚔️", description: "みつなりが ほれこんだ ぶしょう" },
  { id: "odanobunaga", word: "odanobunaga", name: "織田信長", reading: "おだのぶなが", emoji: "🔥", description: "てんかとういつを めざした おわりの ぶしょう" },
  { id: "hojoujiyasu", word: "hojoujiyasu", name: "北条氏康", reading: "ほうじょううじやす", emoji: "🛡️", description: "おだわらじょうの めいくん" },
  { id: "ukitahideie", word: "ukitahideie", name: "宇喜多秀家", reading: "うきたひでいえ", emoji: "🌖", description: "ごたいろうの ひとり" },

  { id: "morimotonari", word: "morimotonari", name: "毛利元就", reading: "もうりもとなり", emoji: "⭐", description: "さんぼんの やの おしえで ゆうめい" },
  { id: "datemasamune", word: "datemasamune", name: "伊達政宗", reading: "だてまさむね", emoji: "🌙", description: "どくがんりゅうと よばれた ぶしょう" },
  { id: "azainagamasa", word: "azainagamasa", name: "浅井長政", reading: "あざいながまさ", emoji: "🏯", description: "のぶながの いもうとの おっと" },
  { id: "maedatoshiie", word: "maedatoshiie", name: "前田利家", reading: "まえだとしいえ", emoji: "🌾", description: "かがひゃくまんごくの そ" },
  { id: "kurodakanbee", word: "kurodakanbee", name: "黒田官兵衛", reading: "くろだかんべえ", emoji: "🧠", description: "ひでよしの てんさいぐんし" },
  { id: "katokiyomasa", word: "katokiyomasa", name: "加藤清正", reading: "かとうきよまさ", emoji: "🐯", description: "とらたいじの でんせつ。せいしょこ" },
  { id: "todotakatora", word: "todotakatora", name: "藤堂高虎", reading: "とうどうたかとら", emoji: "🏯", description: "しろづくりの めいじん" },
  { id: "niwanagahide", word: "niwanagahide", name: "丹羽長秀", reading: "にわながひで", emoji: "🍚", description: "のぶながが たよった ちゅうしん" },
  { id: "takedashingen", word: "takedashingen", name: "武田信玄", reading: "たけだしんげん", emoji: "🐎", description: "かいの とら。ふうりんかざんの はた" },
  { id: "uesugikenshin", word: "uesugikenshin", name: "上杉謙信", reading: "うえすぎけんしん", emoji: "❄️", description: "えちごの りゅう。いくさの かみさま" },
  { id: "naoekanetsugu", word: "naoekanetsugu", name: "直江兼続", reading: "なおえかねつぐ", emoji: "❤️", description: "あいの かぶとで しられる ちゅうしん" },
  { id: "morinagayoshi", word: "morinagayoshi", name: "森長可", reading: "もりながよし", emoji: "🐗", description: "おにむしゃと おそれられた" },

  { id: "tokugawaieyasu", word: "tokugawaieyasu", name: "徳川家康", reading: "とくがわいえやす", emoji: "☘️", description: "えどばくふを ひらいた しょうぐん" },
  { id: "sanadayukimura", word: "sanadayukimura", name: "真田幸村", reading: "さなだゆきむら", emoji: "🦌", description: "にほんいちの つわものと よばれた" },
  { id: "takenakahanbee", word: "takenakahanbee", name: "竹中半兵衛", reading: "たけなかはんべえ", emoji: "🧠", description: "ひでよしを ささえた めいぐんし" },
  { id: "kurodanagamasa", word: "kurodanagamasa", name: "黒田長政", reading: "くろだながまさ", emoji: "🐚", description: "せきがはらで だいかつやく" },
  { id: "hondatadakatsu", word: "hondatadakatsu", name: "本多忠勝", reading: "ほんだただかつ", emoji: "🦌", description: "とくがわ してんのうの もうしょう" },
  { id: "sanadamasayuki", word: "sanadamasayuki", name: "真田昌幸", reading: "さなだまさゆき", emoji: "🦊", description: "とくがわを なんども くるしめた" },
  { id: "mogamiyoshiaki", word: "mogamiyoshiaki", name: "最上義光", reading: "もがみよしあき", emoji: "🌾", description: "でわの だいみょう" },
  { id: "shibatakatsuie", word: "shibatakatsuie", name: "柴田勝家", reading: "しばたかついえ", emoji: "🔥", description: "おにしばたと よばれた もうしょう" },
  { id: "akechimitsuhide", word: "akechimitsuhide", name: "明智光秀", reading: "あけちみつひで", emoji: "🟣", description: "ほんのうじで のぶながを たおした" },
  { id: "ishidamitsunari", word: "ishidamitsunari", name: "石田三成", reading: "いしだみつなり", emoji: "⚖️", description: "せきがはらで にしぐんを ひきいた" },
  { id: "ryuzojitakanobu", word: "ryuzojitakanobu", name: "龍造寺隆信", reading: "りゅうぞうじたかのぶ", emoji: "🐉", description: "ひぜんの くまと よばれた" },
  { id: "hosokawatadaoki", word: "hosokawatadaoki", name: "細川忠興", reading: "ほそかわただおき", emoji: "🎴", description: "ぶゆうと ちゃのゆの ぶしょう" },
  { id: "yamamotokansuke", word: "yamamotokansuke", name: "山本勘助", reading: "やまもとかんすけ", emoji: "📜", description: "たけだの でんせつの ぐんし" },
  { id: "kikkawamotoharu", word: "kikkawamotoharu", name: "吉川元春", reading: "きっかわもとはる", emoji: "🏹", description: "もうりりょうせんの ひとり" },
  { id: "otaniyoshitsugu", word: "otaniyoshitsugu", name: "大谷吉継", reading: "おおたによしつぐ", emoji: "🎭", description: "みつなりの しんゆう" },

  { id: "imagawayoshimoto", word: "imagawayoshimoto", name: "今川義元", reading: "いまがわよしもと", emoji: "🎏", description: "かいどういちの ゆみとり" },
  { id: "asakurayoshikage", word: "asakurayoshikage", name: "朝倉義景", reading: "あさくらよしかげ", emoji: "🌸", description: "えちぜんの だいみょう" },
  { id: "shimazuyoshihiro", word: "shimazuyoshihiro", name: "島津義弘", reading: "しまづよしひろ", emoji: "➕", description: "きゅうしゅうの つよい ぶしょう" },
  { id: "fukushimamasanori", word: "fukushimamasanori", name: "福島正則", reading: "ふくしままさのり", emoji: "🍶", description: "しずがたけの しちほんやり" },
  { id: "satakeyoshishige", word: "satakeyoshishige", name: "佐竹義重", reading: "さたけよししげ", emoji: "🎍", description: "おにと よばれた ひたちの ぶしょう" },
  { id: "miyoshinagayoshi", word: "miyoshinagayoshi", name: "三好長慶", reading: "みよしながよし", emoji: "🗡️", description: "きないを しはいした ぶしょう" },
  { id: "takigawakazumasu", word: "takigawakazumasu", name: "滝川一益", reading: "たきがわかずます", emoji: "🔫", description: "てっぽうと いくさの めいじん" },
  { id: "yamagatamasakage", word: "yamagatamasakage", name: "山県昌景", reading: "やまがたまさかげ", emoji: "🐎", description: "たけだの あかぞなえの たいしょう" },
  { id: "toyotomihideyoshi", word: "toyotomihideyoshi", name: "豊臣秀吉", reading: "とよとみひでよし", emoji: "🌅", description: "ひゃくしょうから てんかびとに なった" },
  { id: "matsunagahisahide", word: "matsunagahisahide", name: "松永久秀", reading: "まつながひさひで", emoji: "💣", description: "せんごくの きょうゆうと いわれた" },
  { id: "nabeshimanaoshige", word: "nabeshimanaoshige", name: "鍋島直茂", reading: "なべしまなおしげ", emoji: "🦞", description: "りゅうぞうじを ささえた ぶしょう" },
  { id: "chosokabemotochika", word: "chosokabemotochika", name: "長宗我部元親", reading: "ちょうそかべもとちか", emoji: "🌊", description: "しこくを ほぼ とういつした" },
  { id: "tachibanamuneshige", word: "tachibanamuneshige", name: "立花宗茂", reading: "たちばなむねしげ", emoji: "🌼", description: "さいきょうと よばれた ぶしょう" },
  { id: "kobayakawatakakage", word: "kobayakawatakakage", name: "小早川隆景", reading: "こばやかわたかかげ", emoji: "🌊", description: "もうりりょうせんの ひとり" },
  { id: "hachisukamasakatsu", word: "hachisukamasakatsu", name: "蜂須賀正勝", reading: "はちすかまさかつ", emoji: "🌊", description: "ひでよしを ささえた ぶしょう" }
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
  return WORDS.filter((entry) => worldForLength(entry.word.length).id === worldId);
}

export function worldWordIds(worldId: number): string[] {
  return wordsByWorld(worldId).map((entry) => entry.id);
}
