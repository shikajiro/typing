import { describe, expect, it } from "vitest";
import { createWordSession } from "../core/typingEngine";
import { getCollection } from "./collections";
import { CULTURE_WORDS, CULTURE_WORLDS } from "./culture";
import { HISTORY_WORDS } from "./history";
import { WORDS, romajiOf } from "./words";

const WORLD_IDS = new Set(CULTURE_WORLDS.map((world) => world.id));

describe("nihonbunka data invariants", () => {
  it("every reading turns into lowercase a-z romaji (pure hiragana, no long mark)", () => {
    for (const entry of CULTURE_WORDS) {
      expect(romajiOf(entry)).toMatch(/^[a-z]+$/);
    }
  });

  it("every reading is typeable (engine never throws)", () => {
    for (const entry of CULTURE_WORDS) {
      expect(() => createWordSession(entry.reading)).not.toThrow();
    }
  });

  it("ids are unique", () => {
    const ids = CULTURE_WORDS.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("does not collide with existing ids because collectedIds is shared", () => {
    const existingIds = new Set([...WORDS, ...HISTORY_WORDS].map((entry) => entry.id));
    for (const entry of CULTURE_WORDS) {
      expect(existingIds.has(entry.id)).toBe(false);
    }
  });

  it("every entry has name, reading, emoji, description and culture kind", () => {
    for (const entry of CULTURE_WORDS) {
      expect(entry.name.length).toBeGreaterThan(0);
      expect(entry.reading.length).toBeGreaterThan(0);
      expect(entry.emoji.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThan(0);
      expect(entry.kind).toBe("culture");
    }
  });

  it("every entry points at a real world via worldId", () => {
    for (const entry of CULTURE_WORDS) {
      expect(entry.worldId).toBeDefined();
      expect(WORLD_IDS.has(entry.worldId as number)).toBe(true);
    }
  });

  it("has 20 culture entries split into 4 worlds with 5 entries each", () => {
    const nihonbunka = getCollection("nihonbunka");
    expect(CULTURE_WORDS).toHaveLength(20);
    expect(CULTURE_WORLDS).toHaveLength(4);
    for (const world of CULTURE_WORLDS) {
      expect(nihonbunka.wordsByWorld(world.id)).toHaveLength(5);
    }
  });

  it("does not use images in v1", () => {
    for (const entry of CULTURE_WORDS) {
      expect(entry.image).toBeUndefined();
    }
  });
});
