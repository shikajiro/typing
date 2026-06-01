import { describe, expect, it } from "vitest";
import {
  collectId,
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
      collectedIds: [],
      unlockedWorldIds: [1],
      settings: { assistLevel: 1, soundOn: true }
    });
  });
});

describe("progress: collecting", () => {
  it("adds a collected id without mutating the previous state", () => {
    const initial = createInitialProgress();
    const next = collectId(initial, "oda");

    expect(next.collectedIds).toEqual(["oda"]);
    expect(initial.collectedIds).toEqual([]);
    expect(hasCollected(next, "oda")).toBe(true);
    expect(hasCollected(initial, "oda")).toBe(false);
  });

  it("does not add the same id twice", () => {
    const next = collectId(collectId(createInitialProgress(), "oda"), "oda");
    expect(next.collectedIds).toEqual(["oda"]);
  });
});

describe("progress: world clearing and unlocking", () => {
  it("reports a world cleared only when every member is collected", () => {
    const world = ["oda", "mori", "date"];
    let progress = createInitialProgress();
    progress = collectId(progress, "oda");
    progress = collectId(progress, "mori");

    expect(isWorldCleared(progress, world)).toBe(false);

    progress = collectId(progress, "date");
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
