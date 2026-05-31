// 進捗の保存・復元。localStorage を直接触らず StorageLike を注入することで、
// node 環境でもテストできるようにする。壊れたデータはフォールバックせず例外を投げる。

import { type ProgressState, createInitialProgress } from "./progress";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const progressStorageKey = "sengoku-typing-progress-v1";

function assertProgressState(value: unknown): asserts value is ProgressState {
  const candidate = value as Partial<ProgressState> | null;
  const settings = candidate?.settings as Partial<ProgressState["settings"]> | undefined;
  if (
    !candidate ||
    typeof candidate !== "object" ||
    !Array.isArray(candidate.collectedIds) ||
    !Array.isArray(candidate.unlockedWorldIds) ||
    !settings ||
    typeof settings.assistLevel !== "number" ||
    typeof settings.soundOn !== "boolean"
  ) {
    throw new Error("Saved progress has an invalid shape");
  }
}

export function loadProgress(storage: StorageLike): ProgressState {
  const raw = storage.getItem(progressStorageKey);
  if (raw === null) {
    return createInitialProgress();
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    assertProgressState(parsed);
    console.debug("[typing:storage] Loaded progress", { collected: parsed.collectedIds.length });
    return parsed;
  } catch (error) {
    console.error("[typing:storage] Failed to load progress", { error });
    throw new Error(`Failed to load progress: ${(error as Error).message}`);
  }
}

export function saveProgress(storage: StorageLike, progress: ProgressState): void {
  storage.setItem(progressStorageKey, JSON.stringify(progress));
  console.debug("[typing:storage] Saved progress", { collected: progress.collectedIds.length });
}
