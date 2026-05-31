// プレイヤーの進捗：なかまにした武将（id）・解放したワールド・設定。
// すべて不変更新（前の状態を壊さない）。保存は storage.ts が担当する。
// id はテーマ非依存（武将でも動物でも同じ仕組みで使える）。

export type AssistLevel = 1 | 2 | 3;

export interface Settings {
  assistLevel: AssistLevel;
  soundOn: boolean;
}

export interface ProgressState {
  collectedIds: string[];
  unlockedWorldIds: number[];
  settings: Settings;
}

export function createInitialProgress(): ProgressState {
  return {
    collectedIds: [],
    unlockedWorldIds: [1],
    settings: { assistLevel: 1, soundOn: true }
  };
}

export function hasCollected(progress: ProgressState, id: string): boolean {
  return progress.collectedIds.includes(id);
}

export function collectId(progress: ProgressState, id: string): ProgressState {
  if (hasCollected(progress, id)) {
    return progress;
  }
  const next: ProgressState = {
    ...progress,
    collectedIds: [...progress.collectedIds, id]
  };
  console.debug("[typing:progress] Collected", { id, total: next.collectedIds.length });
  return next;
}

export function isWorldCleared(progress: ProgressState, worldMemberIds: string[]): boolean {
  if (worldMemberIds.length === 0) {
    return false;
  }
  return worldMemberIds.every((id) => hasCollected(progress, id));
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
