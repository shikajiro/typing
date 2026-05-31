import { describe, expect, it } from "vitest";
import {
  collectAnimal,
  createInitialProgress,
  hasCollected,
  isWorldCleared,
  isWorldUnlocked,
  setAssistLevel,
  setSoundOn,
  unlockWorld
} from "./progress";

describe("progress: createInitialProgress", () => {
  it("starts with nothing collected, only world 1 unlocked, full assist and sound on", () => {
    expect(createInitialProgress()).toEqual({
      collectedAnimalIds: [],
      unlockedWorldIds: [1],
      settings: { assistLevel: 1, soundOn: true }
    });
  });
});

describe("progress: collecting animals", () => {
  it("adds a collected animal without mutating the previous state", () => {
    const initial = createInitialProgress();
    const next = collectAnimal(initial, "cat");

    expect(next.collectedAnimalIds).toEqual(["cat"]);
    expect(initial.collectedAnimalIds).toEqual([]);
    expect(hasCollected(next, "cat")).toBe(true);
    expect(hasCollected(initial, "cat")).toBe(false);
  });

  it("does not add the same animal twice", () => {
    const next = collectAnimal(collectAnimal(createInitialProgress(), "cat"), "cat");
    expect(next.collectedAnimalIds).toEqual(["cat"]);
  });
});

describe("progress: world clearing and unlocking", () => {
  it("reports a world cleared only when every one of its animals is collected", () => {
    const world = ["cat", "dog", "pig"];
    let progress = createInitialProgress();
    progress = collectAnimal(progress, "cat");
    progress = collectAnimal(progress, "dog");

    expect(isWorldCleared(progress, world)).toBe(false);

    progress = collectAnimal(progress, "pig");
    expect(isWorldCleared(progress, world)).toBe(true);
  });

  it("never reports an empty world as cleared", () => {
    expect(isWorldCleared(createInitialProgress(), [])).toBe(false);
  });

  it("unlocks a world uniquely", () => {
    const progress = unlockWorld(unlockWorld(createInitialProgress(), 2), 2);

    expect(progress.unlockedWorldIds).toEqual([1, 2]);
    expect(isWorldUnlocked(progress, 2)).toBe(true);
    expect(isWorldUnlocked(progress, 3)).toBe(false);
  });
});

describe("progress: settings", () => {
  it("updates the assist level immutably", () => {
    const initial = createInitialProgress();
    const next = setAssistLevel(initial, 3);

    expect(next.settings.assistLevel).toBe(3);
    expect(initial.settings.assistLevel).toBe(1);
  });

  it("toggles sound immutably", () => {
    const next = setSoundOn(createInitialProgress(), false);
    expect(next.settings.soundOn).toBe(false);
  });
});
