import { describe, expect, it } from "vitest";
import {
  FINGER_COLORS,
  KEY_ROWS,
  evaluateKeyPress,
  getKeySpec,
  letterToCode
} from "./keyboardLayout";

describe("keyboardLayout: getKeySpec", () => {
  it("maps home-position anchors F and J to the index fingers", () => {
    expect(getKeySpec("KeyF")).toMatchObject({
      code: "KeyF",
      label: "F",
      letter: "f",
      hand: "left",
      finger: "L-index",
      fingerLabel: "ひだりの ひとさしゆび",
      row: "home"
    });
    expect(getKeySpec("KeyJ")).toMatchObject({
      code: "KeyJ",
      label: "J",
      letter: "j",
      hand: "right",
      finger: "R-index",
      fingerLabel: "みぎの ひとさしゆび",
      row: "home"
    });
  });

  it("assigns A to the left pinky on the home row", () => {
    expect(getKeySpec("KeyA")).toMatchObject({ finger: "L-pinky", hand: "left", row: "home" });
  });

  it("assigns C to the left middle finger on the bottom row", () => {
    expect(getKeySpec("KeyC")).toMatchObject({ finger: "L-middle", hand: "left", row: "bottom" });
  });

  it("assigns P to the right pinky on the top row", () => {
    expect(getKeySpec("KeyP")).toMatchObject({ finger: "R-pinky", hand: "right", row: "top" });
  });

  it("gives every key the color of its finger", () => {
    expect(getKeySpec("KeyF").color).toBe(FINGER_COLORS["L-index"]);
  });

  it("throws on an unsupported (non-letter) key code so lessons cannot silently misroute", () => {
    expect(() => getKeySpec("Digit1")).toThrow(/Unsupported key code/);
    expect(() => getKeySpec("Space")).toThrow(/Unsupported key code/);
  });
});

describe("keyboardLayout: letterToCode", () => {
  it("converts a lower or upper case letter to its KeyboardEvent.code", () => {
    expect(letterToCode("c")).toBe("KeyC");
    expect(letterToCode("C")).toBe("KeyC");
  });

  it("throws on a non-letter character", () => {
    expect(() => letterToCode("1")).toThrow(/Unsupported letter/);
  });
});

describe("keyboardLayout: evaluateKeyPress", () => {
  it("judges by KeyboardEvent.code so IME/かな mode does not break it", () => {
    const result = evaluateKeyPress("KeyA", { code: "KeyA", key: "ち" });

    expect(result.correct).toBe(true);
    expect(result.expected.label).toBe("A");
    expect(result.actualKey).toBe("ち");
  });

  it("reports an incorrect press when the code does not match", () => {
    const result = evaluateKeyPress("KeyA", { code: "KeyS", key: "s" });

    expect(result.correct).toBe(false);
  });
});

describe("keyboardLayout: finger colors", () => {
  it("uses 8 distinct colors, one per finger", () => {
    const colors = Object.values(FINGER_COLORS);

    expect(colors).toHaveLength(8);
    expect(new Set(colors).size).toBe(8);
  });
});

describe("keyboardLayout: KEY_ROWS layout for rendering", () => {
  it("has three QWERTY rows covering all 26 letters", () => {
    expect(KEY_ROWS).toHaveLength(3);
    const codes = KEY_ROWS.flat();
    expect(codes).toHaveLength(26);
    expect(new Set(codes).size).toBe(26);
  });

  it("contains only renderable key codes", () => {
    for (const code of KEY_ROWS.flat()) {
      expect(() => getKeySpec(code)).not.toThrow();
    }
  });

  it("puts the home row (with A F J L) in the middle", () => {
    expect(KEY_ROWS[1]).toEqual([
      "KeyA",
      "KeyS",
      "KeyD",
      "KeyF",
      "KeyG",
      "KeyH",
      "KeyJ",
      "KeyK",
      "KeyL"
    ]);
  });
});
