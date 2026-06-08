import { describe, expect, it } from "vitest";
import type { GameWord } from "../data/words";
import { createQuizQuestions } from "./quiz";

const entries: GameWord[] = [
  {
    id: "oda",
    name: "織田信長",
    reading: "おだのぶなが",
    emoji: "🔥",
    description: "尾張[おわり]の 大名[だいみょう]。天下統一[てんかとういつ]に ちかづいた。",
    life: "1534〜1582",
    domain: "尾張[おわり]",
    battles: "桶狭間[おけはざま]の 戦[たたか]い",
    trivia: "本能寺[ほんのうじ]で たおれた。"
  },
  {
    id: "takeda",
    name: "武田信玄",
    reading: "たけだしんげん",
    emoji: "🐎",
    description: "甲斐[かい]の 大名[だいみょう]。風林火山[ふうりんかざん]で しられる。",
    life: "1521〜1573",
    domain: "甲斐[かい]",
    battles: "川中島[かわなかじま]の 戦[たたか]い",
    trivia: "甲斐[かい]の 虎[とら]と よばれた。"
  },
  {
    id: "uesugi",
    name: "上杉謙信",
    reading: "うえすぎけんしん",
    emoji: "❄️",
    description: "越後[えちご]の 大名[だいみょう]。戦[いくさ]の 神[かみ]と よばれた。",
    life: "1530〜1578",
    domain: "越後[えちご]",
    battles: "手取川[てどりがわ]の 戦[たたか]い",
    trivia: "毘沙門天[びしゃもんてん]を 信[しん]じた。"
  },
  {
    id: "tokugawa",
    name: "徳川家康",
    reading: "とくがわいえやす",
    emoji: "☘️",
    description: "江戸幕府[えどばくふ]を ひらいた 初代[しょだい]将軍[しょうぐん]。",
    life: "1543〜1616",
    domain: "三河[みかわ]",
    battles: "関ヶ原[せきがはら]の 戦[たたか]い",
    trivia: "長生[ながい]きして 天下[てんか]を とった。"
  },
  {
    id: "toyotomi",
    name: "豊臣秀吉",
    reading: "とよとみひでよし",
    emoji: "🌅",
    description: "百姓[ひゃくしょう]から 天下人[てんかびと]に なった。",
    life: "1537〜1598",
    domain: "尾張[おわり]",
    battles: "小田原征伐[おだわらせいばつ]",
    trivia: "太閤[たいこう]とも よばれる。"
  },
  {
    id: "date",
    name: "伊達政宗",
    reading: "だてまさむね",
    emoji: "🌙",
    description: "独眼竜[どくがんりゅう]と よばれた 奥州[おうしゅう]の 大名[だいみょう]。",
    life: "1567〜1636",
    domain: "陸奥[むつ]",
    battles: "摺上原[すりあげはら]の 戦[たたか]い",
    trivia: "右[みぎ]の 目[め]が 見[み]えなくなった。"
  },
  {
    id: "mori",
    name: "毛利元就",
    reading: "もうりもとなり",
    emoji: "⭐",
    description: "三本[さんぼん]の 矢[や]で ゆうめいな 中国地方[ちゅうごくちほう]の 大名[だいみょう]。",
    life: "1497〜1571",
    domain: "安芸[あき]",
    battles: "厳島[いつくしま]の 戦[たたか]い",
    trivia: "子[こ]どもに 力[ちから]を あわせる よう おしえた。"
  },
  {
    id: "sanada",
    name: "真田幸村",
    reading: "さなだゆきむら",
    emoji: "🦌",
    description: "日本一[にほんいち]の 兵[つわもの]と たたえられた。",
    life: "1567ごろ〜1615",
    domain: "信濃[しなの]",
    battles: "大坂[おおさか]の 陣[じん]",
    trivia: "本当[ほんとう]の 名前[なまえ]は 信繁[のぶしげ]。"
  },
  {
    id: "akechi",
    name: "明智光秀",
    reading: "あけちみつひで",
    emoji: "🟣",
    description: "本能寺[ほんのうじ]の 変[へん]で 信長[のぶなが]を たおした。",
    life: "1528ごろ〜1582",
    domain: "丹波[たんば]",
    battles: "山崎[やまざき]の 戦[たたか]い",
    trivia: "医者[いしゃ]だった 可能性[かのうせい]が ある。"
  },
  {
    id: "ishida",
    name: "石田三成",
    reading: "いしだみつなり",
    emoji: "⚖️",
    description: "関ヶ原[せきがはら]の 戦[たたか]いで 西軍[せいぐん]を ひきいた。",
    life: "1560〜1600",
    domain: "近江[おうみ]",
    battles: "忍城[おしじょう]の 水攻[みずぜ]め",
    trivia: "三献茶[さんけんちゃ]の 話[はなし]が ゆうめい。"
  },
  {
    id: "hojo",
    name: "北条氏康",
    reading: "ほうじょううじやす",
    emoji: "🛡️",
    description: "小田原城[おだわらじょう]を まもりぬいた 関東[かんとう]の 名君[めいくん]。",
    life: "1515〜1571",
    domain: "相模[さがみ]",
    battles: "河越[かわごえ]の 夜戦[やせん]",
    trivia: "小田原[おだわら]の 城[しろ]を まもった。"
  }
];

function fixedRng(): number {
  return 0;
}

describe("createQuizQuestions", () => {
  it("throws when fewer than 4 collected entries are available", () => {
    expect(() => createQuizQuestions(entries.slice(0, 3), { rng: fixedRng })).toThrow(/at least 4/);
  });

  it("creates four choices for every question and includes the answer exactly once", () => {
    const questions = createQuizQuestions(entries.slice(0, 4), { rng: fixedRng });

    expect(questions).toHaveLength(4);
    for (const question of questions) {
      expect(question.choices).toHaveLength(4);
      expect(question.prompt.length).toBeGreaterThan(0);
      expect(question.sourceField).toBeDefined();
      expect(question.choices.filter((choice) => choice.id === question.answerId)).toHaveLength(1);
    }
  });

  it("uses only the entries passed to it for answers and choices", () => {
    const collected = entries.slice(2, 8);
    const allowedIds = new Set(collected.map((entry) => entry.id));
    const questions = createQuizQuestions(collected, { rng: fixedRng });

    for (const question of questions) {
      expect(allowedIds.has(question.answerId)).toBe(true);
      for (const choice of question.choices) {
        expect(allowedIds.has(choice.id)).toBe(true);
      }
    }
  });

  it("limits the question count to 10 collected entries", () => {
    expect(createQuizQuestions(entries.slice(0, 6), { rng: fixedRng })).toHaveLength(6);
    expect(createQuizQuestions(entries, { rng: fixedRng })).toHaveLength(10);
  });
});
