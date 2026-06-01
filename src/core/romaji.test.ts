import { describe, expect, it } from "vitest";
import { canonicalRomaji, kanaToSegments } from "./romaji";

describe("romaji: kanaToSegments", () => {
  it("offers multiple accepted spellings for a kana", () => {
    expect(kanaToSegments("し")).toEqual([{ options: ["shi", "si"] }]);
    expect(kanaToSegments("つ")).toEqual([{ options: ["tsu", "tu"] }]);
  });

  it("treats ん as n with nn allowed", () => {
    expect(kanaToSegments("ん")).toEqual([{ options: ["n", "nn"] }]);
  });

  it("handles youon combos as one segment", () => {
    expect(kanaToSegments("しょ")).toEqual([{ options: ["sho", "syo"] }]);
    expect(kanaToSegments("りゅ")).toEqual([{ options: ["ryu"] }]);
  });

  it("handles sokuon by doubling the next consonant as its own segment", () => {
    expect(kanaToSegments("きっか").map((s) => s.options[0])).toEqual(["ki", "k", "ka"]);
  });

  it("throws on a character it cannot romanize (no silent fallback)", () => {
    expect(() => kanaToSegments("漢")).toThrow(/Unsupported kana/);
  });
});

describe("romaji: canonicalRomaji", () => {
  it("joins the first option of each segment (wapuro style, as typed)", () => {
    expect(canonicalRomaji("しんげん")).toBe("shingen");
    expect(canonicalRomaji("きっかわ")).toBe("kikkawa");
    expect(canonicalRomaji("りゅうぞうじ")).toBe("ryuuzouji");
    expect(canonicalRomaji("ほうじょうそううん")).toBe("houjousouun");
  });
});
