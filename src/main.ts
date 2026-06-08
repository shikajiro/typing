// アプリの起点。進捗を読み込み、画面ルーティングと進捗の保存をまとめる。

import "./style.css";
import { GameAudio } from "./audio/audio";
import { getCollection } from "./data/collections";
import type { ProgressState } from "./core/progress";
import { loadProgress, saveProgress } from "./core/storage";
import { renderGameScreen } from "./ui/gameScreen";
import { renderMenuScreen } from "./ui/menuScreen";
import { renderQuizScreen } from "./ui/quizScreen";
import type { AppContext, Route } from "./ui/types";
import { renderWarmupScreen } from "./ui/warmupScreen";
import { renderWorldMapScreen } from "./ui/worldMapScreen";
import { renderZukanScreen } from "./ui/zukanScreen";

const root = document.getElementById("app");
if (!root) {
  throw new Error("Root element #app not found");
}

let progress: ProgressState = loadProgress(window.localStorage);
const audio = new GameAudio(progress.settings.soundOn);
let teardown: (() => void) | null = null;

function navigate(route: Route): void {
  console.debug("[typing:router] navigate", route);
  if (teardown) {
    teardown();
    teardown = null;
  }
  switch (route.name) {
    case "menu":
      teardown = renderMenuScreen(ctx);
      break;
    case "warmup":
      teardown = renderWarmupScreen(ctx);
      break;
    case "worldmap":
      teardown = renderWorldMapScreen(ctx, getCollection(route.theme));
      break;
    case "game":
      teardown = renderGameScreen(ctx, getCollection(route.theme), route.worldId);
      break;
    case "zukan":
      teardown = renderZukanScreen(ctx, getCollection(route.theme));
      break;
    case "quiz":
      teardown = renderQuizScreen(ctx, getCollection(route.theme));
      break;
  }
}

const ctx: AppContext = {
  root,
  audio,
  getProgress: () => progress,
  update: (mutator) => {
    progress = mutator(progress);
    saveProgress(window.localStorage, progress);
    return progress;
  },
  navigate
};

navigate({ name: "menu" });
