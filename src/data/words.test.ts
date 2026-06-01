import { describe, expect, it } from "vitest";
import { createWordSession } from "../core/typingEngine";
import { WORDS, getWord, romajiOf, wordsByWorld, worldWordIds } from "./words";
import { WORLDS, getWorld, nextWorldId } from "./worlds";

describe("sengoku warlord data invariants", () => {
  it("every reading turns into lowercase a-z romaji", () => {
    for (const entry of WORDS) {
      expect(romajiOf(entry)).toMatch(/^[a-z]+$/);
    }
  });

  it("every reading is typeable (engine never throws)", () => {
    for (const entry of WORDS) {
      expect(() => createWordSession(entry.reading)).not.toThrow();
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

  it("any image is a Wikimedia Commons URL", () => {
    for (const entry of WORDS) {
      if (entry.image) {
        expect(entry.image).toMatch(/^https:\/\/upload\.wikimedia\.org\//);
      }
    }
  });
});

describe("stage assignment by romaji length", () => {
  it("partitions all warlords across the worlds with no drops or overlaps", () => {
    const assigned = WORLDS.flatMap((world) => worldWordIds(world.id));
    expect(assigned).toHaveLength(WORDS.length);
    expect(new Set(assigned).size).toBe(WORDS.length);
  });

  it("each world has at least 6 warlords", () => {
    for (const world of WORLDS) {
      expect(wordsByWorld(world.id).length).toBeGreaterThanOrEqual(6);
    }
  });

  it("worlds get harder: average romaji length increases with order", () => {
    const avg = (ids: string[]) =>
      ids.reduce((sum, id) => sum + romajiOf(getWord(id)).length, 0) / ids.length;
    const a1 = avg(worldWordIds(1));
    const a4 = avg(worldWordIds(4));
    expect(a4).toBeGreaterThan(a1);
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
