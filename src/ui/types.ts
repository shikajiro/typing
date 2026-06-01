import type { GameAudio } from "../audio/audio";
import type { ProgressState } from "../core/progress";

export type Route =
  | { name: "menu" }
  | { name: "warmup" }
  | { name: "worldmap" }
  | { name: "game"; worldId: number }
  | { name: "zukan" };

// 画面に渡す環境。進捗の読み取り・更新（保存込み）・画面遷移・音を提供する。
export interface AppContext {
  root: HTMLElement;
  audio: GameAudio;
  getProgress(): ProgressState;
  update(mutator: (progress: ProgressState) => ProgressState): ProgressState;
  navigate(route: Route): void;
}
