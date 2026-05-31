// 1 つの単語を打ち切るまでの進行を管理する純粋ロジック。
// まちがえても進行はリセットせず、ペナルティも与えない（小2が嫌にならない設計）。

import { letterToCode } from "./keyboardLayout";

export interface WordSession {
  word: string;
  codes: string[];
  index: number;
  mistakes: number;
  done: boolean;
}

export interface PressResult {
  session: WordSession;
  correct: boolean;
  completed: boolean;
}

export function createWordSession(word: string): WordSession {
  const codes = Array.from(word).map((char) => letterToCode(char));
  const session: WordSession = {
    word,
    codes,
    index: 0,
    mistakes: 0,
    done: false
  };
  console.debug("[typing:engine] Created word session", { word, codes });
  return session;
}

export function expectedCode(session: WordSession): string | null {
  return session.done ? null : session.codes[session.index];
}

export function pressKey(session: WordSession, code: string): PressResult {
  if (session.done) {
    console.error("[typing:engine] Key pressed after word already done", {
      word: session.word
    });
    throw new Error("Word session is already done");
  }

  const correct = code === session.codes[session.index];
  if (!correct) {
    const next: WordSession = { ...session, mistakes: session.mistakes + 1 };
    console.debug("[typing:engine] Wrong key", {
      word: session.word,
      expected: session.codes[session.index],
      actual: code
    });
    return { session: next, correct: false, completed: false };
  }

  const index = session.index + 1;
  const done = index >= session.codes.length;
  const next: WordSession = { ...session, index, done };
  console.debug("[typing:engine] Correct key", {
    word: session.word,
    index,
    done
  });
  return { session: next, correct: true, completed: done };
}
