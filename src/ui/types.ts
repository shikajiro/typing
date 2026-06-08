import type { GameAudio } from "../audio/audio";
import type { ProgressState } from "../core/progress";
import type { ThemeKey } from "../data/collections";

export type Route =
  | { name: "menu" }
  | { name: "warmup" }
  | { name: "worldmap"; theme: ThemeKey }
  | { name: "game"; theme: ThemeKey; worldId: number }
  | { name: "zukan"; theme: ThemeKey }
  | { name: "quiz"; theme: ThemeKey };

// 画面に渡す環境。進捗の読み取り・更新（保存込み）・画面遷移・音を提供する。
export interface AppContext {
  root: HTMLElement;
  audio: GameAudio;
  getProgress(): ProgressState;
  update(mutator: (progress: ProgressState) => ProgressState): ProgressState;
  navigate(route: Route): void;
}
