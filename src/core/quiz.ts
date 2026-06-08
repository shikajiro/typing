import type { GameWord } from "../data/words";

export const DEFAULT_QUIZ_QUESTION_LIMIT = 10;
export const QUIZ_CHOICE_COUNT = 4;

export type QuizSourceField = "description" | "life" | "domain" | "battles" | "trivia";

export interface QuizChoice {
  id: string;
  name: string;
  reading: string;
  emoji: string;
  kind?: GameWord["kind"];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  sourceField: QuizSourceField;
  answerId: string;
  choices: QuizChoice[];
}

export interface QuizOptions {
  maxQuestions?: number;
  choiceCount?: number;
  rng?: () => number;
}

const SOURCE_FIELDS: QuizSourceField[] = ["description", "trivia", "battles", "domain", "life"];

function assertQuizConfig(entries: GameWord[], maxQuestions: number, choiceCount: number): void {
  if (!Number.isInteger(maxQuestions) || maxQuestions < 1) {
    console.error("[typing:quiz] Invalid max question count", { maxQuestions });
    throw new Error(`Quiz maxQuestions must be a positive integer: ${maxQuestions}`);
  }
  if (!Number.isInteger(choiceCount) || choiceCount < 2) {
    console.error("[typing:quiz] Invalid choice count", { choiceCount });
    throw new Error(`Quiz choiceCount must be an integer of at least 2: ${choiceCount}`);
  }
  if (entries.length < choiceCount) {
    console.error("[typing:quiz] Not enough collected entries", { collected: entries.length, choiceCount });
    throw new Error(`Quiz requires at least ${choiceCount} collected entries`);
  }
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1, rng);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function randomIndex(length: number, rng: () => number): number {
  const raw = rng();
  const normalized = Number.isFinite(raw) ? Math.abs(raw % 1) : 0;
  return Math.floor(normalized * length);
}

function pickSource(entry: GameWord, rng: () => number): { field: QuizSourceField; prompt: string } {
  const available = SOURCE_FIELDS.filter((field) => {
    const value = entry[field];
    return typeof value === "string" && value.length > 0;
  });
  if (available.length === 0) {
    console.error("[typing:quiz] Entry has no quiz source", { id: entry.id });
    throw new Error(`Quiz entry has no source text: ${entry.id}`);
  }
  const field = available[randomIndex(available.length, rng)];
  const prompt = entry[field];
  if (!prompt) {
    console.error("[typing:quiz] Picked empty quiz source", { id: entry.id, field });
    throw new Error(`Quiz source is empty: ${entry.id}.${field}`);
  }
  return { field, prompt };
}

function toChoice(entry: GameWord): QuizChoice {
  return {
    id: entry.id,
    name: entry.name,
    reading: entry.reading,
    emoji: entry.emoji,
    kind: entry.kind
  };
}

export function createQuizQuestions(entries: GameWord[], options: QuizOptions = {}): QuizQuestion[] {
  const maxQuestions = options.maxQuestions ?? DEFAULT_QUIZ_QUESTION_LIMIT;
  const choiceCount = options.choiceCount ?? QUIZ_CHOICE_COUNT;
  const rng = options.rng ?? Math.random;
  assertQuizConfig(entries, maxQuestions, choiceCount);

  const questionCount = Math.min(maxQuestions, entries.length);
  const answers = shuffle(entries, rng).slice(0, questionCount);
  const questions = answers.map((answer) => {
    const source = pickSource(answer, rng);
    const distractors = shuffle(
      entries.filter((entry) => entry.id !== answer.id),
      rng
    ).slice(0, choiceCount - 1);
    if (distractors.length !== choiceCount - 1) {
      console.error("[typing:quiz] Failed to create enough distractors", {
        answerId: answer.id,
        distractors: distractors.length,
        choiceCount
      });
      throw new Error(`Quiz could not create choices for: ${answer.id}`);
    }
    const choices = shuffle([answer, ...distractors], rng).map(toChoice);
    return {
      id: `${answer.id}:${source.field}`,
      prompt: source.prompt,
      sourceField: source.field,
      answerId: answer.id,
      choices
    };
  });

  console.debug("[typing:quiz] Created questions", { entries: entries.length, questions: questions.length });
  return questions;
}
