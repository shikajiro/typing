import { describe, expect, it } from "vitest";
import { createWordSession } from "../core/typingEngine";
import { WORDS, getWord, wordsByWorld, worldWordIds } from "./words";
import { WORLDS, getWorld, nextWorldId } from "./worlds";

describe("sengoku word data invariants", () => {
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

  it("every word belongs to a defined world", () => {
    const worldIds = new Set(WORLDS.map((world) => world.id));
    for (const entry of WORDS) {
      expect(worldIds.has(entry.worldId)).toBe(true);
    }
  });

  it("each word has a kanji name, a kana reading and an emoji", () => {
    for (const entry of WORDS) {
      expect(entry.name.length).toBeGreaterThan(0);
      expect(entry.reading.length).toBeGreaterThan(0);
      expect(entry.emoji.length).toBeGreaterThan(0);
    }
  });
});

describe("difficulty grows by romaji length per world", () => {
  const ranges: Record<number, [number, number]> = {
    1: [1, 4],
    2: [5, 5],
    3: [6, 6],
    4: [7, 7],
    5: [8, 99]
  };

  for (const world of [1, 2, 3, 4, 5]) {
    it(`world ${world} words fit its length range`, () => {
      const [min, max] = ranges[world];
      for (const entry of wordsByWorld(world)) {
        expect(entry.word.length).toBeGreaterThanOrEqual(min);
        expect(entry.word.length).toBeLessThanOrEqual(max);
      }
    });
  }

  it("each world has at least 6 words", () => {
    for (const world of WORLDS) {
      expect(wordsByWorld(world.id).length).toBeGreaterThanOrEqual(6);
    }
  });
});

describe("worlds", () => {
  it("has 5 worlds with unique ids", () => {
    expect(WORLDS).toHaveLength(5);
    expect(new Set(WORLDS.map((world) => world.id)).size).toBe(5);
  });

  it("links worlds in order and ends with null", () => {
    expect(nextWorldId(1)).toBe(2);
    expect(nextWorldId(4)).toBe(5);
    expect(nextWorldId(5)).toBeNull();
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
