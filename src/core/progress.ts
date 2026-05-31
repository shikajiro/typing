// プレイヤーの進捗：集めたどうぶつ・解放したワールド・設定。
// すべて不変更新（前の状態を壊さない）。保存は storage.ts が担当する。

export type AssistLevel = 1 | 2 | 3;

export interface Settings {
  assistLevel: AssistLevel;
  soundOn: boolean;
}

export interface ProgressState {
  collectedAnimalIds: string[];
  unlockedWorldIds: number[];
  settings: Settings;
}

export function createInitialProgress(): ProgressState {
  return {
    collectedAnimalIds: [],
    unlockedWorldIds: [1],
    settings: { assistLevel: 1, soundOn: true }
  };
}

export function hasCollected(progress: ProgressState, animalId: string): boolean {
  return progress.collectedAnimalIds.includes(animalId);
}

export function collectAnimal(progress: ProgressState, animalId: string): ProgressState {
  if (hasCollected(progress, animalId)) {
    return progress;
  }
  const next: ProgressState = {
    ...progress,
    collectedAnimalIds: [...progress.collectedAnimalIds, animalId]
  };
  console.debug("[typing:progress] Collected animal", {
    animalId,
    total: next.collectedAnimalIds.length
  });
  return next;
}

export function isWorldCleared(progress: ProgressState, worldAnimalIds: string[]): boolean {
  if (worldAnimalIds.length === 0) {
    return false;
  }
  return worldAnimalIds.every((id) => hasCollected(progress, id));
}

export function isWorldUnlocked(progress: ProgressState, worldId: number): boolean {
  return progress.unlockedWorldIds.includes(worldId);
}

export function unlockWorld(progress: ProgressState, worldId: number): ProgressState {
  if (isWorldUnlocked(progress, worldId)) {
    return progress;
  }
  const next: ProgressState = {
    ...progress,
    unlockedWorldIds: [...progress.unlockedWorldIds, worldId].sort((a, b) => a - b)
  };
  console.debug("[typing:progress] Unlocked world", { worldId });
  return next;
}

export function setAssistLevel(progress: ProgressState, assistLevel: AssistLevel): ProgressState {
  return { ...progress, settings: { ...progress.settings, assistLevel } };
}

export function setSoundOn(progress: ProgressState, soundOn: boolean): ProgressState {
  return { ...progress, settings: { ...progress.settings, soundOn } };
}
