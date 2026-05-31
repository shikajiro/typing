// キーボード配置と「どの指で打つか」の対応。
// ブラインドタッチ指導の土台なので、指割当は標準のタッチタイピング配置に厳密準拠する。
// 判定は KeyboardEvent.code で行う（IME/かなモードでも物理キーで正しく判定できる）。

export type FingerId =
  | "L-pinky"
  | "L-ring"
  | "L-middle"
  | "L-index"
  | "R-index"
  | "R-middle"
  | "R-ring"
  | "R-pinky";

export type Hand = "left" | "right";
export type KeyRow = "top" | "home" | "bottom";

export interface KeySpec {
  code: string;
  label: string;
  letter: string;
  hand: Hand;
  finger: FingerId;
  fingerLabel: string;
  color: string;
  row: KeyRow;
}

// 指ごとに 8 色（小2が「色＝指」を見分けられるよう全て別色）。
export const FINGER_COLORS: Record<FingerId, string> = {
  "L-pinky": "#e74c3c",
  "L-ring": "#e67e22",
  "L-middle": "#f1c40f",
  "L-index": "#2ecc71",
  "R-index": "#3498db",
  "R-middle": "#9b59b6",
  "R-ring": "#e84393",
  "R-pinky": "#1abc9c"
};

// ふりがな世代向けに、指の名前はすべてひらがなで。
export const FINGER_LABELS: Record<FingerId, string> = {
  "L-pinky": "ひだりの こゆび",
  "L-ring": "ひだりの くすりゆび",
  "L-middle": "ひだりの なかゆび",
  "L-index": "ひだりの ひとさしゆび",
  "R-index": "みぎの ひとさしゆび",
  "R-middle": "みぎの なかゆび",
  "R-ring": "みぎの くすりゆび",
  "R-pinky": "みぎの こゆび"
};

interface LetterInfo {
  finger: FingerId;
  row: KeyRow;
}

// アルファベット 26 文字の指・段の割当（標準配置）。
const LETTERS: Record<string, LetterInfo> = {
  // 上段
  q: { finger: "L-pinky", row: "top" },
  w: { finger: "L-ring", row: "top" },
  e: { finger: "L-middle", row: "top" },
  r: { finger: "L-index", row: "top" },
  t: { finger: "L-index", row: "top" },
  y: { finger: "R-index", row: "top" },
  u: { finger: "R-index", row: "top" },
  i: { finger: "R-middle", row: "top" },
  o: { finger: "R-ring", row: "top" },
  p: { finger: "R-pinky", row: "top" },
  // ホームポジション
  a: { finger: "L-pinky", row: "home" },
  s: { finger: "L-ring", row: "home" },
  d: { finger: "L-middle", row: "home" },
  f: { finger: "L-index", row: "home" },
  g: { finger: "L-index", row: "home" },
  h: { finger: "R-index", row: "home" },
  j: { finger: "R-index", row: "home" },
  k: { finger: "R-middle", row: "home" },
  l: { finger: "R-ring", row: "home" },
  // 下段
  z: { finger: "L-pinky", row: "bottom" },
  x: { finger: "L-ring", row: "bottom" },
  c: { finger: "L-middle", row: "bottom" },
  v: { finger: "L-index", row: "bottom" },
  b: { finger: "L-index", row: "bottom" },
  n: { finger: "R-index", row: "bottom" },
  m: { finger: "R-index", row: "bottom" }
};

// 画面キーボードを描くための QWERTY 3 段（コードの並び）。
export const KEY_ROWS: string[][] = [
  ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP"],
  ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL"],
  ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM"]
];

function handOf(finger: FingerId): Hand {
  return finger.startsWith("L-") ? "left" : "right";
}

export function getKeySpec(code: string): KeySpec {
  const match = /^Key([A-Z])$/.exec(code);
  if (!match) {
    console.error("[typing:keyboard] Unsupported key code", { code });
    throw new Error(`Unsupported key code: ${code}`);
  }

  const label = match[1];
  const letter = label.toLowerCase();
  const info = LETTERS[letter];

  return {
    code,
    label,
    letter,
    hand: handOf(info.finger),
    finger: info.finger,
    fingerLabel: FINGER_LABELS[info.finger],
    color: FINGER_COLORS[info.finger],
    row: info.row
  };
}

export function letterToCode(letter: string): string {
  if (!/^[a-zA-Z]$/.test(letter)) {
    console.error("[typing:keyboard] Unsupported letter", { letter });
    throw new Error(`Unsupported letter: ${letter}`);
  }
  return `Key${letter.toUpperCase()}`;
}

export interface KeyPressResult {
  correct: boolean;
  expected: KeySpec;
  actualCode: string;
  actualKey: string;
}

export function evaluateKeyPress(
  expectedCode: string,
  event: { code: string; key: string }
): KeyPressResult {
  const expected = getKeySpec(expectedCode);
  const result: KeyPressResult = {
    correct: event.code === expectedCode,
    expected,
    actualCode: event.code,
    actualKey: event.key
  };

  console.debug("[typing:key-press]", {
    expected: expectedCode,
    actual: event.code,
    correct: result.correct
  });
  return result;
}
