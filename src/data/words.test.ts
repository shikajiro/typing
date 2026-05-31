import { describe, expect, it } from "vitest";
import { createWordSession } from "../core/typingEngine";
import { WORDS, getWord, wordsByWorld, worldWordIds } from "./words";
import { WORLDS, getWorld, nextWorldId, worldForLength } from "./worlds";

describe("sengoku warlord data invariants", () => {
  it("every word is lowercase a-z romaji so it can always be typed", () => {
    for (const entry of WORDS) {
      expect(entry.word).toMatch(/^[a-z]+$/);
    }
  });

  it("every word maps to typeable key codes (engine never throws)", () => {
    for (const entry of WORDS) {
      expect(() => createWordSession(entry.word)).not.toThrow();
    }
  });

  it("ids are unique", () => {
    const ids = WORDS.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every warlord has a full kanji name, kana reading, emoji and description", () => {
    for (const entry of WORDS) {
      expect(entry.name.length).toBeGreaterThan(0);
      expect(entry.reading.length).toBeGreaterThan(0);
      expect(entry.emoji.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("worlds derived from romaji length", () => {
  it("every word length maps to exactly one world", () => {
    for (const entry of WORDS) {
      expect(() => worldForLength(entry.word.length)).not.toThrow();
    }
  });

  it("worlds partition all words with no drops or overlaps", () => {
    const assigned = WORLDS.flatMap((world) => worldWordIds(world.id));
    expect(assigned).toHaveLength(WORDS.length);
    expect(new Set(assigned).size).toBe(WORDS.length);
  });

  it("each world has at least 6 warlords", () => {
    for (const world of WORLDS) {
      expect(wordsByWorld(world.id).length).toBeGreaterThanOrEqual(6);
    }
  });

  it("words sit within their world's length range", () => {
    for (const world of WORLDS) {
      for (const entry of wordsByWorld(world.id)) {
        expect(entry.word.length).toBeGreaterThanOrEqual(world.minLen);
        expect(entry.word.length).toBeLessThanOrEqual(world.maxLen);
      }
    }
  });
});

describe("worlds", () => {
  it("has 4 worlds with unique ids", () => {
    expect(WORLDS).toHaveLength(4);
    expect(new Set(WORLDS.map((world) => world.id)).size).toBe(4);
  });

  it("links worlds in order and ends with null", () => {
    expect(nextWorldId(1)).toBe(2);
    expect(nextWorldId(3)).toBe(4);
    expect(nextWorldId(4)).toBeNull();
  });

  it("getWorld and getWord throw on unknown ids (no silent fallback)", () => {
    expect(() => getWorld(99)).toThrow();
    expect(() => getWord("dragon")).toThrow();
  });

  it("worldWordIds returns the id list for that world", () => {
    expect(worldWordIds(1)).toEqual(wordsByWorld(1).map((entry) => entry.id));
    expect(worldWordIds(1).length).toBeGreaterThan(0);
  });
});
