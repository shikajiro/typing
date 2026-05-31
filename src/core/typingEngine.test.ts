import { describe, expect, it } from "vitest";
import { canonicalRomaji } from "./romaji";
import { createWordSession, expectedCode, pressKey, type WordSession } from "./typingEngine";

function typeAll(reading: string, romaji: string): WordSession {
  let session = createWordSession(reading);
  for (const ch of romaji) {
    session = pressKey(session, `Key${ch.toUpperCase()}`).session;
  }
  return session;
}

describe("typingEngine: canonical input", () => {
  it("creates a session from a kana reading", () => {
    const session = createWordSession("しんげん");
    expect(session.reading).toBe("しんげん");
    expect(session.index).toBe(0);
    expect(session.done).toBe(false);
  });

  it("completes when the canonical spelling is typed", () => {
    const session = typeAll("しんげん", canonicalRomaji("しんげん"));
    expect(session.done).toBe(true);
    expect(expectedCode(session)).toBeNull();
  });

  it("points at the canonical next key", () => {
    expect(expectedCode(createWordSession("しんげん"))).toBe("KeyS");
  });
});

describe("typingEngine: flexible spellings", () => {
  it("accepts si as well as shi for し", () => {
    expect(typeAll("し", "shi").done).toBe(true);
    expect(typeAll("し", "si").done).toBe(true);
  });

  it("accepts tu for つ and ti for ち", () => {
    expect(typeAll("つ", "tu").done).toBe(true);
    expect(typeAll("ち", "ti").done).toBe(true);
  });

  it("accepts nn or single n for ん in the middle of a word", () => {
    expect(typeAll("しんや", "shinnya").done).toBe(true);
    expect(typeAll("しんや", "shinya").done).toBe(true);
  });

  it("completes a final ん with a single n", () => {
    expect(typeAll("ほん", "hon").done).toBe(true);
  });

  it("lets a single n for ん carry over to the next sound", () => {
    // しんけん → typing s,h,i,n,k,e,n  (ん as single n before け)
    expect(typeAll("しんけん", "shinken").done).toBe(true);
  });

  it("accepts a sokuon by doubling the consonant", () => {
    expect(typeAll("きっかわ", "kikkawa").done).toBe(true);
  });
});

describe("typingEngine: mistakes", () => {
  it("counts a wrong key as a mistake without advancing", () => {
    const start = createWordSession("か");
    const { session, correct } = pressKey(start, "KeyX");

    expect(correct).toBe(false);
    expect(session.mistakes).toBe(1);
    expect(session.index).toBe(0);
    expect(start.mistakes).toBe(0);
  });

  it("throws if a key is pressed after completion", () => {
    const done = typeAll("か", "ka");
    expect(() => pressKey(done, "KeyA")).toThrow(/already done/);
  });
});
