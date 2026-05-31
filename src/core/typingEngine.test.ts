import { describe, expect, it } from "vitest";
import { createWordSession, expectedCode, pressKey } from "./typingEngine";

describe("typingEngine: createWordSession", () => {
  it("turns a word into the sequence of key codes to press", () => {
    const session = createWordSession("cat");

    expect(session.word).toBe("cat");
    expect(session.codes).toEqual(["KeyC", "KeyA", "KeyT"]);
    expect(session.index).toBe(0);
    expect(session.mistakes).toBe(0);
    expect(session.done).toBe(false);
  });

  it("throws on a word containing a non-letter", () => {
    expect(() => createWordSession("ca7")).toThrow(/Unsupported letter/);
  });
});

describe("typingEngine: expectedCode", () => {
  it("points at the next key to press", () => {
    expect(expectedCode(createWordSession("cat"))).toBe("KeyC");
  });
});

describe("typingEngine: pressKey", () => {
  it("advances on the correct key without mutating the previous session", () => {
    const start = createWordSession("cat");
    const { session, correct, completed } = pressKey(start, "KeyC");

    expect(correct).toBe(true);
    expect(completed).toBe(false);
    expect(session.index).toBe(1);
    expect(expectedCode(session)).toBe("KeyA");
    expect(start.index).toBe(0); // immutable
  });

  it("counts a wrong press as a mistake but does not advance or reset", () => {
    const afterC = pressKey(createWordSession("cat"), "KeyC").session;
    const { session, correct } = pressKey(afterC, "KeyX");

    expect(correct).toBe(false);
    expect(session.index).toBe(1); // stays put, no penalty reset
    expect(session.mistakes).toBe(1);
  });

  it("marks the session done when the last letter is typed", () => {
    let session = createWordSession("cat");
    let completed = false;
    for (const code of ["KeyC", "KeyA", "KeyT"]) {
      const result = pressKey(session, code);
      session = result.session;
      completed = result.completed;
    }

    expect(completed).toBe(true);
    expect(session.done).toBe(true);
    expect(expectedCode(session)).toBeNull();
  });

  it("throws if a key is pressed after the word is already done", () => {
    let session = createWordSession("hi");
    session = pressKey(session, "KeyH").session;
    session = pressKey(session, "KeyI").session;

    expect(() => pressKey(session, "KeyA")).toThrow(/already done/);
  });
});
