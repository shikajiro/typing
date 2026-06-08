import { describe, expect, it } from "vitest";
import { createWordSession } from "../core/typingEngine";
import { getCollection } from "./collections";
import { HISTORY_WORDS, HISTORY_WORLDS } from "./history";
import { WORDS, romajiOf } from "./words";

const WORLD_IDS = new Set(HISTORY_WORLDS.map((world) => world.id));

describe("nihonshi data invariants", () => {
  it("every reading turns into lowercase a-z romaji (pure hiragana, no long mark)", () => {
    for (const entry of HISTORY_WORDS) {
      expect(romajiOf(entry)).toMatch(/^[a-z]+$/);
    }
  });

  it("every reading is typeable (engine never throws)", () => {
    for (const entry of HISTORY_WORDS) {
      expect(() => createWordSession(entry.reading)).not.toThrow();
    }
  });

  it("ids are unique", () => {
    const ids = HISTORY_WORDS.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("does not collide with sengoku ids (collectedIds is shared)", () => {
    const sengokuIds = new Set(WORDS.map((entry) => entry.id));
    for (const entry of HISTORY_WORDS) {
      expect(sengokuIds.has(entry.id)).toBe(false);
    }
  });

  it("every entry has name, reading, emoji and description", () => {
    for (const entry of HISTORY_WORDS) {
      expect(entry.name.length).toBeGreaterThan(0);
      expect(entry.reading.length).toBeGreaterThan(0);
      expect(entry.emoji.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });

  it("every entry points at a real world via worldId", () => {
    for (const entry of HISTORY_WORDS) {
      expect(entry.worldId).toBeDefined();
      expect(WORLD_IDS.has(entry.worldId as number)).toBe(true);
    }
  });

  it("every entry is a person or an event, and both kinds exist", () => {
    for (const entry of HISTORY_WORDS) {
      expect(entry.kind === "person" || entry.kind === "event").toBe(true);
    }
    expect(HISTORY_WORDS.some((entry) => entry.kind === "event")).toBe(true);
    expect(HISTORY_WORDS.some((entry) => entry.kind === "person")).toBe(true);
  });

  it("any image is a Wikimedia Commons URL", () => {
    for (const entry of HISTORY_WORDS) {
      if (entry.image) {
        expect(entry.image).toMatch(/^https:\/\/upload\.wikimedia\.org\//);
      }
    }
  });
});

describe("nihonshi worlds (eras)", () => {
  it("has 4 eras with ids separate from sengoku (1-4)", () => {
    expect(HISTORY_WORLDS).toHaveLength(4);
    for (const world of HISTORY_WORLDS) {
      expect(world.id).toBeGreaterThanOrEqual(11);
    }
  });

  it("each era has at least 4 entries", () => {
    const nihonshi = getCollection("nihonshi");
    for (const world of HISTORY_WORLDS) {
      expect(nihonshi.wordsByWorld(world.id).length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("collections registry", () => {
  it("returns each theme and throws on unknown (no silent fallback)", () => {
    expect(getCollection("sengoku").key).toBe("sengoku");
    expect(getCollection("nihonshi").key).toBe("nihonshi");
    expect(getCollection("nihonbunka").key).toBe("nihonbunka");
    // @ts-expect-error unknown theme is rejected at runtime
    expect(() => getCollection("showa")).toThrow();
  });

  it("nihonshi first world is unlockable and worlds link in order", () => {
    const nihonshi = getCollection("nihonshi");
    expect(nihonshi.firstWorldId).toBe(11);
    expect(nihonshi.nextWorldId(11)).toBe(12);
    expect(nihonshi.nextWorldId(14)).toBeNull();
    expect(() => nihonshi.getWorld(99)).toThrow();
  });

  it("nihonbunka first world is unlockable and worlds link in order", () => {
    const nihonbunka = getCollection("nihonbunka");
    expect(nihonbunka.firstWorldId).toBe(21);
    expect(nihonbunka.nextWorldId(21)).toBe(22);
    expect(nihonbunka.nextWorldId(24)).toBeNull();
    expect(() => nihonbunka.getWorld(99)).toThrow();
  });

  it("nihonshi wordsByWorld covers all entries with no drops", () => {
    const nihonshi = getCollection("nihonshi");
    const assigned = HISTORY_WORLDS.flatMap((world) => nihonshi.wordsByWorld(world.id).map((entry) => entry.id));
    expect(assigned).toHaveLength(HISTORY_WORDS.length);
    expect(new Set(assigned).size).toBe(HISTORY_WORDS.length);
  });
});
