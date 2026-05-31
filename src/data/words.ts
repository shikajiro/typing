// 戦国武将＝集める対象。打つローマ字は reading（ひらがな）から自動生成（romaji.ts）。
// si/shi など複数の打ち方を受理する。name は漢字フルネーム、reading はふりがな、
// emoji はシンボル、image は肖像（あれば／Wikimedia Commons）、description はやさしい解説。
// 解説は "漢字[よみ]" 記法で、漢字にふりがなを振って表示する。
// 名前・読み・肖像は Wikipedia / Wikimedia Commons を参考。所属ステージは worlds.ts が文字数から自動算出。

import { canonicalRomaji } from "../core/romaji";
import { WORLDS } from "./worlds";

export interface GameWord {
  id: string;
  name: string;
  reading: string;
  emoji: string;
  description: string;
  image?: string;
}

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons/thumb";

export const WORDS: GameWord[] = [
  { id: "hojosoun", name: "北条早雲", reading: "ほうじょうそううん", emoji: "🔺", description: "戦国大名[せんごくだいみょう]の さきがけ。小田原[おだわら]を とって 関東[かんとう]に ちからを ひろげた。" },
  { id: "iinaomasa", name: "井伊直政", reading: "いいなおまさ", emoji: "🔴", description: "徳川[とくがわ]四天王[してんのう]の ひとり。赤[あか]い よろいの 軍団[ぐんだん]で おそれられた。" },
  { id: "saitodosan", name: "斎藤道三", reading: "さいとうどうさん", emoji: "🐍", description: "「美濃[みの]の まむし」と よばれた 大名[だいみょう]。下剋上[げこくじょう]で のしあがった。" },
  { id: "otomosorin", name: "大友宗麟", reading: "おおともそうりん", emoji: "⛪", description: "九州[きゅうしゅう]の キリシタン大名[だいみょう]。南蛮[なんばん]ぼうえきで さかえた。" },
  { id: "maedakeiji", name: "前田慶次", reading: "まえだけいじ", emoji: "🌪️", description: "ゆうめいな かぶき者[もの]。じゆうきままに いきた ごうけつ。" },
  { id: "shimasakon", name: "島左近", reading: "しまさこん", emoji: "⚔️", description: "石田三成[いしだみつなり]が ほれこんで まねいた 名将[めいしょう]。" },
  { id: "odanobunaga", name: "織田信長", reading: "おだのぶなが", emoji: "🔥", description: "尾張[おわり]の 大名[だいみょう]。天下統一[てんかとういつ]に いちばん ちかづいたが、本能寺[ほんのうじ]で たおれた。" },
  { id: "hojoujiyasu", name: "北条氏康", reading: "ほうじょううじやす", emoji: "🛡️", description: "小田原城[おだわらじょう]を まもりぬいた 関東[かんとう]の 名君[めいくん]。" },
  { id: "ukitahideie", name: "宇喜多秀家", reading: "うきたひでいえ", emoji: "🌖", description: "豊臣[とよとみ]の 五大老[ごたいろう]の ひとり。関ヶ原[せきがはら]で 西軍[せいぐん]に ついた。" },

  { id: "morimotonari", name: "毛利元就", reading: "もうりもとなり", emoji: "⭐", description: "「三本[さんぼん]の 矢[や]」の おしえで ゆうめい。中国地方[ちゅうごくちほう]を まとめた 大名[だいみょう]。", image: `${COMMONS}/4/40/Mori_Motonari.jpg/330px-Mori_Motonari.jpg` },
  { id: "datemasamune", name: "伊達政宗", reading: "だてまさむね", emoji: "🌙", description: "「独眼竜[どくがんりゅう]」と よばれた 奥州[おうしゅう]の 若[わか]き 大名[だいみょう]。", image: `${COMMONS}/1/19/MASAMUNE777.PNG/330px-MASAMUNE777.PNG` },
  { id: "azainagamasa", name: "浅井長政", reading: "あざいながまさ", emoji: "🏯", description: "近江[おうみ]の 大名[だいみょう]。信長[のぶなが]の いもうと お市[いち]の おっと。" },
  { id: "maedatoshiie", name: "前田利家", reading: "まえだとしいえ", emoji: "🌾", description: "加賀百万石[かがひゃくまんごく]の もとを きずいた、秀吉[ひでよし]の 親友[しんゆう]。", image: `${COMMONS}/9/96/Maeda_Toshiie.jpg/330px-Maeda_Toshiie.jpg` },
  { id: "kurodakanbee", name: "黒田官兵衛", reading: "くろだかんべえ", emoji: "🧠", description: "秀吉[ひでよし]を ささえた 天才軍師[てんさいぐんし]。" },
  { id: "katokiyomasa", name: "加藤清正", reading: "かとうきよまさ", emoji: "🐯", description: "「賤ヶ岳[しずがたけ]の 七本槍[しちほんやり]」の ひとり。築城[ちくじょう]の 名人[めいじん]。" },
  { id: "todotakatora", name: "藤堂高虎", reading: "とうどうたかとら", emoji: "🏯", description: "たくさんの 城[しろ]を きずいた 築城[ちくじょう]の 名人[めいじん]。" },
  { id: "niwanagahide", name: "丹羽長秀", reading: "にわながひで", emoji: "🍚", description: "信長[のぶなが]が ふかく たよりに した 重臣[じゅうしん]。" },
  { id: "takedashingen", name: "武田信玄", reading: "たけだしんげん", emoji: "🐎", description: "「甲斐[かい]の 虎[とら]」。「風林火山[ふうりんかざん]」の はたで しられる つよい 大名[だいみょう]。", image: `${COMMONS}/3/33/Takeda_Harunobu.jpg/330px-Takeda_Harunobu.jpg` },
  { id: "uesugikenshin", name: "上杉謙信", reading: "うえすぎけんしん", emoji: "❄️", description: "「越後[えちご]の 龍[りゅう]」。戦[いくさ]の 神[かみ]とも よばれた めいしょう。", image: `${COMMONS}/8/88/Uesugi_Kenshin_Portrait_from_Uesugi_Shrine.png/330px-Uesugi_Kenshin_Portrait_from_Uesugi_Shrine.png` },
  { id: "naoekanetsugu", name: "直江兼続", reading: "なおえかねつぐ", emoji: "❤️", description: "「愛[あい]」の かぶとで しられる 上杉[うえすぎ]の 重臣[じゅうしん]。" },
  { id: "morinagayoshi", name: "森長可", reading: "もりながよし", emoji: "🐗", description: "「鬼武蔵[おにむさし]」と おそれられた もうしょう。" },

  { id: "tokugawaieyasu", name: "徳川家康", reading: "とくがわいえやす", emoji: "☘️", description: "江戸幕府[えどばくふ]を ひらいた 初代[しょだい]将軍[しょうぐん]。じっと まって 天下[てんか]を とった。" },
  { id: "sanadayukimura", name: "真田幸村", reading: "さなだゆきむら", emoji: "🦌", description: "「日本一[にほんいち]の 兵[つわもの]」と たたえられた 名将[めいしょう]。", image: `${COMMONS}/b/b3/Sanada_Yukimura.jpg/330px-Sanada_Yukimura.jpg` },
  { id: "takenakahanbee", name: "竹中半兵衛", reading: "たけなかはんべえ", emoji: "🧠", description: "秀吉[ひでよし]を ささえた しずかな 名軍師[めいぐんし]。" },
  { id: "kurodanagamasa", name: "黒田長政", reading: "くろだながまさ", emoji: "🐚", description: "関ヶ原[せきがはら]で 大活躍[だいかつやく]した 黒田[くろだ]の とのさま。" },
  { id: "hondatadakatsu", name: "本多忠勝", reading: "ほんだただかつ", emoji: "🦌", description: "徳川[とくがわ]四天王[してんのう]の ひとり。一生[いっしょう]むきずの もうしょう。" },
  { id: "sanadamasayuki", name: "真田昌幸", reading: "さなだまさゆき", emoji: "🦊", description: "徳川[とくがわ]の 大軍[たいぐん]を なんども やぶった ちりゃくの 名人[めいじん]。" },
  { id: "mogamiyoshiaki", name: "最上義光", reading: "もがみよしあき", emoji: "🌾", description: "出羽[でわ]を まとめあげた 大名[だいみょう]。" },
  { id: "shibatakatsuie", name: "柴田勝家", reading: "しばたかついえ", emoji: "🔥", description: "「鬼柴田[おにしばた]」と よばれた 信長[のぶなが]の もうしょう。" },
  { id: "akechimitsuhide", name: "明智光秀", reading: "あけちみつひで", emoji: "🟣", description: "本能寺[ほんのうじ]の 変[へん]で 信長[のぶなが]を たおした 武将[ぶしょう]。", image: `${COMMONS}/c/c3/Akechi_Mitsuhide8.jpg/330px-Akechi_Mitsuhide8.jpg` },
  { id: "ishidamitsunari", name: "石田三成", reading: "いしだみつなり", emoji: "⚖️", description: "関ヶ原[せきがはら]の 戦[たたか]いで 西軍[せいぐん]を ひきいた 知恵者[ちえもの]。", image: `${COMMONS}/8/80/Ishida_Mitsunari.jpg/330px-Ishida_Mitsunari.jpg` },
  { id: "ryuzojitakanobu", name: "龍造寺隆信", reading: "りゅうぞうじたかのぶ", emoji: "🐉", description: "「肥前[ひぜん]の 熊[くま]」と よばれた 九州[きゅうしゅう]の 大名[だいみょう]。" },
  { id: "hosokawatadaoki", name: "細川忠興", reading: "ほそかわただおき", emoji: "🎴", description: "武勇[ぶゆう]と 茶[ちゃ]の湯[ゆ]に すぐれた 文化人[ぶんかじん]大名[だいみょう]。" },
  { id: "yamamotokansuke", name: "山本勘助", reading: "やまもとかんすけ", emoji: "📜", description: "武田[たけだ]に つかえた でんせつの 軍師[ぐんし]。" },
  { id: "kikkawamotoharu", name: "吉川元春", reading: "きっかわもとはる", emoji: "🏹", description: "毛利[もうり]を ささえた 「両川[りょうせん]」の ひとり。" },
  { id: "otaniyoshitsugu", name: "大谷吉継", reading: "おおたによしつぐ", emoji: "🎭", description: "石田三成[いしだみつなり]の 親友[しんゆう]。関ヶ原[せきがはら]で ともに たたかった。" },

  { id: "imagawayoshimoto", name: "今川義元", reading: "いまがわよしもと", emoji: "🎏", description: "「海道一[かいどういち]の 弓取[ゆみと]り」と よばれた 駿河[するが]の 大名[だいみょう]。" },
  { id: "asakurayoshikage", name: "朝倉義景", reading: "あさくらよしかげ", emoji: "🌸", description: "越前[えちぜん]を おさめた 大名[だいみょう]。" },
  { id: "shimazuyoshihiro", name: "島津義弘", reading: "しまづよしひろ", emoji: "➕", description: "九州[きゅうしゅう]の つよい 大名[だいみょう]。関ヶ原[せきがはら]の 「退[の]き口[ぐち]」で ゆうめい。" },
  { id: "fukushimamasanori", name: "福島正則", reading: "ふくしままさのり", emoji: "🍶", description: "「賤ヶ岳[しずがたけ]の 七本槍[しちほんやり]」の 筆頭[ひっとう]。" },
  { id: "satakeyoshishige", name: "佐竹義重", reading: "さたけよししげ", emoji: "🎍", description: "「鬼[おに]」と よばれた 常陸[ひたち]の 大名[だいみょう]。" },
  { id: "miyoshinagayoshi", name: "三好長慶", reading: "みよしながよし", emoji: "🗡️", description: "畿内[きない]を しはいした 戦国[せんごく]の 実力者[じつりょくしゃ]。" },
  { id: "takigawakazumasu", name: "滝川一益", reading: "たきがわかずます", emoji: "🔫", description: "鉄砲[てっぽう]と 戦[いくさ]に すぐれた 信長[のぶなが]の 重臣[じゅうしん]。" },
  { id: "yamagatamasakage", name: "山県昌景", reading: "やまがたまさかげ", emoji: "🐎", description: "武田[たけだ]の 赤備[あかぞな]えを ひきいた 名将[めいしょう]。" },
  { id: "toyotomihideyoshi", name: "豊臣秀吉", reading: "とよとみひでよし", emoji: "🌅", description: "百姓[ひゃくしょう]から 天下人[てんかびと]に なった。「太閤[たいこう]」とも よばれる。", image: `${COMMONS}/0/09/Toyotomi_Hideyoshi_c1598_Kodai-ji_Temple.png/330px-Toyotomi_Hideyoshi_c1598_Kodai-ji_Temple.png` },
  { id: "matsunagahisahide", name: "松永久秀", reading: "まつながひさひで", emoji: "💣", description: "戦国[せんごく]の きょうゆうとも いわれた なぞ おおき 武将[ぶしょう]。" },
  { id: "nabeshimanaoshige", name: "鍋島直茂", reading: "なべしまなおしげ", emoji: "🦞", description: "龍造寺[りゅうぞうじ]を ささえ、のちに 佐賀[さが]を おさめた 武将[ぶしょう]。" },
  { id: "chosokabemotochika", name: "長宗我部元親", reading: "ちょうそかべもとちか", emoji: "🌊", description: "四国[しこく]を ほぼ 統一[とういつ]した 土佐[とさ]の 大名[だいみょう]。" },
  { id: "tachibanamuneshige", name: "立花宗茂", reading: "たちばなむねしげ", emoji: "🌼", description: "「西国一[さいごくいち]」と たたえられた 九州[きゅうしゅう]の 名将[めいしょう]。" },
  { id: "kobayakawatakakage", name: "小早川隆景", reading: "こばやかわたかかげ", emoji: "🌊", description: "毛利[もうり]を ささえた 「両川[りょうせん]」の ひとり。かしこい 武将[ぶしょう]。" },
  { id: "hachisukamasakatsu", name: "蜂須賀正勝", reading: "はちすかまさかつ", emoji: "🌊", description: "秀吉[ひでよし]を はやくから ささえた たよれる 武将[ぶしょう]。" }
];

export function getWord(id: string): GameWord {
  const found = WORDS.find((candidate) => candidate.id === id);
  if (!found) {
    console.error("[typing:words] Unknown word", { id });
    throw new Error(`Unknown word: ${id}`);
  }
  return found;
}

export function romajiOf(entry: GameWord): string {
  return canonicalRomaji(entry.reading);
}

// 武将をローマ字の文字数でならべ、順位を 4 ステージへ均等配分（短い順＝やさしい順）。
const SORTED_IDS = [...WORDS]
  .sort((a, b) => romajiOf(a).length - romajiOf(b).length || a.id.localeCompare(b.id))
  .map((entry) => entry.id);
const PER_WORLD = Math.ceil(WORDS.length / WORLDS.length);

function worldIdOf(entry: GameWord): number {
  const rank = SORTED_IDS.indexOf(entry.id);
  return Math.min(WORLDS.length, Math.floor(rank / PER_WORLD) + 1);
}

export function wordsByWorld(worldId: number): GameWord[] {
  return WORDS.filter((entry) => worldIdOf(entry) === worldId);
}

export function worldWordIds(worldId: number): string[] {
  return wordsByWorld(worldId).map((entry) => entry.id);
}
