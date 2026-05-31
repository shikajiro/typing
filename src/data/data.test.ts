import { describe, expect, it } from "vitest";
import { createWordSession } from "../core/typingEngine";
import { ANIMALS, animalsByWorld, getAnimal, worldAnimalIds } from "./animals";
import { WORLDS, getWorld, nextWorldId } from "./worlds";

describe("animal data invariants", () => {
  it("every word is lowercase a-z so it can always be typed", () => {
    for (const animal of ANIMALS) {
      expect(animal.word).toMatch(/^[a-z]+$/);
    }
  });

  it("every word maps to typeable key codes (engine never throws)", () => {
    for (const animal of ANIMALS) {
      expect(() => createWordSession(animal.word)).not.toThrow();
    }
  });

  it("animal ids are unique", () => {
    const ids = ANIMALS.map((animal) => animal.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every animal belongs to a defined world", () => {
    const worldIds = new Set(WORLDS.map((world) => world.id));
    for (const animal of ANIMALS) {
      expect(worldIds.has(animal.worldId)).toBe(true);
    }
  });

  it("each animal has a kana reading and an emoji", () => {
    for (const animal of ANIMALS) {
      expect(animal.kana.length).toBeGreaterThan(0);
      expect(animal.emoji.length).toBeGreaterThan(0);
    }
  });
});

describe("difficulty grows by word length per world", () => {
  it("world 1 words are 3 letters", () => {
    for (const animal of animalsByWorld(1)) {
      expect(animal.word).toHaveLength(3);
    }
  });

  it("world 2 words are 4 letters", () => {
    for (const animal of animalsByWorld(2)) {
      expect(animal.word).toHaveLength(4);
    }
  });

  it("world 3 words are 5 or more letters", () => {
    for (const animal of animalsByWorld(3)) {
      expect(animal.word.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("each world has at least 6 animals", () => {
    for (const world of WORLDS) {
      expect(animalsByWorld(world.id).length).toBeGreaterThanOrEqual(6);
    }
  });
});

describe("worlds", () => {
  it("has 3 worlds with unique ids", () => {
    expect(WORLDS).toHaveLength(3);
    expect(new Set(WORLDS.map((world) => world.id)).size).toBe(3);
  });

  it("links worlds in order and ends with null", () => {
    expect(nextWorldId(1)).toBe(2);
    expect(nextWorldId(2)).toBe(3);
    expect(nextWorldId(3)).toBeNull();
  });

  it("getWorld and getAnimal throw on unknown ids (no silent fallback)", () => {
    expect(() => getWorld(99)).toThrow();
    expect(() => getAnimal("unicorn")).toThrow();
  });

  it("worldAnimalIds returns the collected-id list for that world", () => {
    expect(worldAnimalIds(1)).toEqual(animalsByWorld(1).map((animal) => animal.id));
    expect(worldAnimalIds(1).length).toBeGreaterThan(0);
  });
});
