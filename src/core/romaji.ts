// かな（ひらがな読み）→ ローマ字の「打ち方の候補」に変換する。
// ローマ字には複数パターン（し=shi/si、つ=tsu/tu、ん=n/nn …）があるので、
// それらのどれで打っても正解になるよう、各かなを options（受理する綴り）に展開する。
// options[0] は画面に出す代表（キャノニカル）綴り。

export interface Segment {
  options: string[];
}

// 単独かな → ローマ字候補
const BASE: Record<string, string[]> = {
  あ: ["a"], い: ["i"], う: ["u"], え: ["e"], お: ["o"],
  か: ["ka"], き: ["ki"], く: ["ku"], け: ["ke"], こ: ["ko"],
  さ: ["sa"], し: ["shi", "si"], す: ["su"], せ: ["se"], そ: ["so"],
  た: ["ta"], ち: ["chi", "ti"], つ: ["tsu", "tu"], て: ["te"], と: ["to"],
  な: ["na"], に: ["ni"], ぬ: ["nu"], ね: ["ne"], の: ["no"],
  は: ["ha"], ひ: ["hi"], ふ: ["fu", "hu"], へ: ["he"], ほ: ["ho"],
  ま: ["ma"], み: ["mi"], む: ["mu"], め: ["me"], も: ["mo"],
  や: ["ya"], ゆ: ["yu"], よ: ["yo"],
  ら: ["ra"], り: ["ri"], る: ["ru"], れ: ["re"], ろ: ["ro"],
  わ: ["wa"], ゐ: ["i"], ゑ: ["e"], を: ["wo", "o"], ん: ["n", "nn"],
  が: ["ga"], ぎ: ["gi"], ぐ: ["gu"], げ: ["ge"], ご: ["go"],
  ざ: ["za"], じ: ["ji", "zi"], ず: ["zu"], ぜ: ["ze"], ぞ: ["zo"],
  だ: ["da"], ぢ: ["ji", "di", "zi"], づ: ["zu", "du"], で: ["de"], ど: ["do"],
  ば: ["ba"], び: ["bi"], ぶ: ["bu"], べ: ["be"], ぼ: ["bo"],
  ぱ: ["pa"], ぴ: ["pi"], ぷ: ["pu"], ぺ: ["pe"], ぽ: ["po"],
  ぁ: ["xa", "la"], ぃ: ["xi", "li"], ぅ: ["xu", "lu"], ぇ: ["xe", "le"], ぉ: ["xo", "lo"],
  ー: ["-"]
};

// 拗音（ゃゅょ をともなう 2 文字）→ ローマ字候補
const COMBO: Record<string, string[]> = {
  きゃ: ["kya"], きゅ: ["kyu"], きょ: ["kyo"],
  しゃ: ["sha", "sya"], しゅ: ["shu", "syu"], しょ: ["sho", "syo"],
  ちゃ: ["cha", "tya"], ちゅ: ["chu", "tyu"], ちょ: ["cho", "tyo"],
  にゃ: ["nya"], にゅ: ["nyu"], にょ: ["nyo"],
  ひゃ: ["hya"], ひゅ: ["hyu"], ひょ: ["hyo"],
  みゃ: ["mya"], みゅ: ["myu"], みょ: ["myo"],
  りゃ: ["rya"], りゅ: ["ryu"], りょ: ["ryo"],
  ぎゃ: ["gya"], ぎゅ: ["gyu"], ぎょ: ["gyo"],
  じゃ: ["ja", "zya", "jya"], じゅ: ["ju", "zyu", "jyu"], じょ: ["jo", "zyo", "jyo"],
  ぢゃ: ["ja", "dya"], ぢゅ: ["ju", "dyu"], ぢょ: ["jo", "dyo"],
  びゃ: ["bya"], びゅ: ["byu"], びょ: ["byo"],
  ぴゃ: ["pya"], ぴゅ: ["pyu"], ぴょ: ["pyo"]
};

const SMALL_Y = new Set(["ゃ", "ゅ", "ょ"]);

function unitAt(reading: string, i: number): { options: string[]; length: number } {
  const c = reading[i];
  const next = reading[i + 1];
  if (next && SMALL_Y.has(next)) {
    const combo = COMBO[c + next];
    if (combo) {
      return { options: combo, length: 2 };
    }
  }
  const base = BASE[c];
  if (base) {
    return { options: base, length: 1 };
  }
  console.error("[typing:romaji] Unsupported kana", { char: c, reading });
  throw new Error(`Unsupported kana: ${c}`);
}

export function kanaToSegments(reading: string): Segment[] {
  const segments: Segment[] = [];
  let i = 0;
  while (i < reading.length) {
    if (reading[i] === "っ") {
      // 促音：つぎの音の最初の子音を重ねる
      const nextUnit = unitAt(reading, i + 1);
      const consonants = [...new Set(nextUnit.options.map((option) => option[0]))];
      segments.push({ options: consonants });
      i += 1;
      continue;
    }
    const unit = unitAt(reading, i);
    segments.push({ options: unit.options });
    i += unit.length;
  }
  return segments;
}

export function canonicalRomaji(reading: string): string {
  return kanaToSegments(reading)
    .map((segment) => segment.options[0])
    .join("");
}
