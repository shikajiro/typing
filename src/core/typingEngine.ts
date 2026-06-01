// 1 つのことばを打ち切るまでの進行を管理する。読み（ひらがな）をローマ字の候補列に展開し、
// どの綴り方（shi/si、tsu/tu、ん=n/nn、促音…）で打っても進めるよう柔軟に判定する。
// まちがえても進行はリセットせず、ペナルティも与えない（小2が嫌にならない設計）。

import { getKeySpec, letterToCode } from "./keyboardLayout";
import { type Segment, kanaToSegments } from "./romaji";

export interface WordSession {
  reading: string;
  segments: Segment[];
  index: number; // いま打っているセグメント
  buffer: string; // 現セグメントで打ち込み済みの文字
  mistakes: number;
  done: boolean;
}

export interface PressResult {
  session: WordSession;
  correct: boolean;
  completed: boolean;
}

export function createWordSession(reading: string): WordSession {
  const segments = kanaToSegments(reading);
  const session: WordSession = {
    reading,
    segments,
    index: 0,
    buffer: "",
    mistakes: 0,
    done: segments.length === 0
  };
  console.debug("[typing:engine] Created word session", { reading, segments: segments.length });
  return session;
}

// 画面のローマ字タイルの進捗用：キャノニカル綴りで「何文字打ち終えたか」。
export function progressChars(session: WordSession): number {
  let count = 0;
  for (let i = 0; i < session.index; i += 1) {
    count += session.segments[i].options[0].length;
  }
  return count + session.buffer.length;
}

export function expectedCode(session: WordSession): string | null {
  if (session.done) return null;
  const segment = session.segments[session.index];
  const consistent = segment.options.filter((option) => option.startsWith(session.buffer));
  const option = consistent[0] ?? segment.options[0];
  if (option.length > session.buffer.length) {
    return letterToCode(option[session.buffer.length]);
  }
  // 現セグメントは打ち終わって次を待っている（ん の単独 n 待ちなど）→ つぎのセグメントの頭を案内
  const next = session.segments[session.index + 1];
  return next ? letterToCode(next.options[0][0]) : null;
}

export function pressKey(session: WordSession, code: string): PressResult {
  if (session.done) {
    console.error("[typing:engine] Key pressed after word already done", { reading: session.reading });
    throw new Error("Word session is already done");
  }

  const char = getKeySpec(code).letter;
  let index = session.index;
  let buffer = session.buffer;

  // 最大 2 回試す（ん の単独 n などで現セグメントを確定し、同じ打鍵を次セグメントへ送るため）
  for (let attempt = 0; attempt < 2 && index < session.segments.length; attempt += 1) {
    const segment = session.segments[index];
    const candidate = buffer + char;
    const prefixMatches = segment.options.filter((option) => option.startsWith(candidate));

    if (prefixMatches.length > 0) {
      const exact = segment.options.includes(candidate);
      const longerExists = prefixMatches.some((option) => option.length > candidate.length);
      const isLast = index === session.segments.length - 1;
      if (exact && (!longerExists || isLast)) {
        index += 1;
        buffer = "";
      } else {
        buffer = candidate;
      }
      const done = index >= session.segments.length;
      const next: WordSession = { ...session, index, buffer, done };
      console.debug("[typing:engine] Correct", { reading: session.reading, index, buffer, done });
      return { session: next, correct: true, completed: done };
    }

    // この打鍵では現セグメントを伸ばせない。すでに現バッファが現セグメントを満たすなら確定して次へ送る。
    if (buffer.length > 0 && segment.options.includes(buffer)) {
      index += 1;
      buffer = "";
      continue;
    }
    break;
  }

  // どこにも当てはまらない＝まちがい（進行はそのまま、回数だけ記録）
  const next: WordSession = { ...session, mistakes: session.mistakes + 1 };
  console.debug("[typing:engine] Wrong key", { reading: session.reading, char });
  return { session: next, correct: false, completed: false };
}
