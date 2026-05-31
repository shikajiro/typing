import { describe, expect, it } from "vitest";
import { createInitialProgress } from "./progress";
import { type StorageLike, loadProgress, progressStorageKey, saveProgress } from "./storage";

function createMemoryStorage(seed: Record<string, string> = {}): StorageLike & {
  data: Record<string, string>;
} {
  return {
    data: { ...seed },
    getItem(key: string) {
      return this.data[key] ?? null;
    },
    setItem(key: string, value: string) {
      this.data[key] = value;
    }
  };
}

describe("storage", () => {
  it("returns the initial progress when nothing is saved yet", () => {
    expect(loadProgress(createMemoryStorage())).toEqual(createInitialProgress());
  });

  it("saves and loads progress through the configured key", () => {
    const storage = createMemoryStorage();
    const progress = { ...createInitialProgress(), collectedIds: ["oda", "takeda"] };

    saveProgress(storage, progress);

    expect(storage.data[progressStorageKey]).toContain("oda");
    expect(loadProgress(storage)).toEqual(progress);
  });

  it("throws instead of silently falling back when saved JSON is broken", () => {
    const storage = createMemoryStorage({ [progressStorageKey]: "{not json" });
    expect(() => loadProgress(storage)).toThrow(/Failed to load progress/);
  });

  it("throws when saved data has the wrong shape", () => {
    const storage = createMemoryStorage({ [progressStorageKey]: JSON.stringify({ foo: 1 }) });
    expect(() => loadProgress(storage)).toThrow(/Failed to load progress/);
  });
});
