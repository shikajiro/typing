// ずかんクイズ。収集済みの図鑑内容だけを使って、説明から名前を当てる4択を出す。

import { createQuizQuestions, QUIZ_CHOICE_COUNT, type QuizChoice, type QuizQuestion } from "../core/quiz";
import type { Collection } from "../data/collections";
import { clear, el, renderRuby, ruby } from "./dom";
import type { AppContext } from "./types";

function quizTitle(collection: Collection): string {
  if (collection.key === "sengoku") return "せんごく クイズ";
  if (collection.key === "nihonshi") return "にほんし クイズ";
  return "にほんぶんか クイズ";
}

function choiceLabel(choice: QuizChoice): HTMLElement {
  const children: HTMLElement[] = [
    el("span", { class: "quiz-choice-emoji", text: choice.emoji }),
    el("span", { class: "quiz-choice-name" }, [ruby(choice.name, choice.reading)])
  ];
  if (choice.kind === "event") {
    children.push(el("span", { class: "kind-tag", text: "📜 できごと" }));
  }
  if (choice.kind === "culture") {
    children.push(el("span", { class: "kind-tag", text: "🏛️ 文化財" }));
  }
  return el("span", { class: "quiz-choice-label" }, children);
}

export function renderQuizScreen(ctx: AppContext, collection: Collection): () => void {
  const progress = ctx.getProgress();
  const collectedEntries = collection.allEntries.filter((entry) => progress.collectedIds.includes(entry.id));

  let questions: QuizQuestion[] = [];
  let questionIndex = 0;
  let correctCount = 0;
  let answeredChoiceId: string | null = null;
  let finishLogged = false;

  const countEl = el("div", { class: "count" });
  const stage = el("main", { class: "quiz-stage" });

  const screen = el("div", { class: "screen quiz-screen" }, [
    el("header", { class: "topbar" }, [
      el("button", { class: "back-button", text: "← もどる", onClick: () => ctx.navigate({ name: "menu" }) }),
      el("div", { class: "world-name", text: quizTitle(collection) }),
      countEl
    ]),
    stage
  ]);

  function renderShortage(): void {
    countEl.textContent = `${collectedEntries.length}/${QUIZ_CHOICE_COUNT}`;
    clear(stage);
    stage.append(
      el("div", { class: "quiz-empty" }, [
        el("div", { class: "quiz-empty-emoji", text: "📖" }),
        el("div", { class: "quiz-empty-title", text: "ずかんを4つあつめるとクイズできるよ" }),
        el("div", { class: "quiz-empty-sub", text: "まずは ステージで ことばを あつめよう" }),
        el("button", {
          class: "big-button primary",
          text: "ステージへ",
          onClick: () => ctx.navigate({ name: "worldmap", theme: collection.key })
        }),
        el("button", {
          class: "big-button",
          text: "ずかんを みる",
          onClick: () => ctx.navigate({ name: "zukan", theme: collection.key })
        })
      ])
    );
  }

  function currentQuestion(): QuizQuestion {
    const question = questions[questionIndex];
    if (!question) {
      console.error("[typing:quiz] Missing question", { questionIndex, total: questions.length });
      throw new Error(`Missing quiz question at index ${questionIndex}`);
    }
    return question;
  }

  function renderFinish(): void {
    if (!finishLogged) {
      console.debug("[typing:quiz] finish", { theme: collection.key, correctCount, total: questions.length });
      finishLogged = true;
    }
    countEl.textContent = `${correctCount}/${questions.length}`;
    clear(stage);
    stage.append(
      el("div", { class: "clear-area quiz-result" }, [
        el("div", { class: "clear-emoji", text: correctCount === questions.length ? "🏆" : "🎉" }),
        el("div", { class: "clear-title", text: `${correctCount}/${questions.length} せいかい！` }),
        el("div", { class: "clear-sub", text: "ずかんを おぼえてきたね" }),
        el("button", {
          class: "big-button primary",
          text: "もういちど",
          onClick: () => ctx.navigate({ name: "quiz", theme: collection.key })
        }),
        el("button", {
          class: "big-button",
          text: "ずかんへ",
          onClick: () => ctx.navigate({ name: "zukan", theme: collection.key })
        }),
        el("button", { class: "big-button", text: "メニューへ", onClick: () => ctx.navigate({ name: "menu" }) })
      ])
    );
  }

  function goNext(): void {
    if (!answeredChoiceId) {
      console.error("[typing:quiz] Tried to advance without an answer", { questionIndex });
      throw new Error("Cannot advance quiz before answering");
    }
    questionIndex += 1;
    answeredChoiceId = null;
    if (questionIndex >= questions.length) {
      renderFinish();
      return;
    }
    renderQuestion();
  }

  function answer(choiceId: string): void {
    if (answeredChoiceId) return;
    const question = currentQuestion();
    const correct = choiceId === question.answerId;
    answeredChoiceId = choiceId;
    if (correct) {
      correctCount += 1;
      ctx.audio.sfx("correct");
    } else {
      ctx.audio.sfx("wrong");
    }
    console.debug("[typing:quiz] answer", {
      theme: collection.key,
      questionIndex,
      answerId: question.answerId,
      choiceId,
      correct
    });
    renderQuestion();
  }

  function renderChoice(question: QuizQuestion, choice: QuizChoice): HTMLButtonElement {
    const answered = answeredChoiceId !== null;
    const isCorrect = answered && choice.id === question.answerId;
    const isWrong = answered && choice.id === answeredChoiceId && choice.id !== question.answerId;
    const button = el("button", { class: "quiz-choice", onClick: () => answer(choice.id) }, [choiceLabel(choice)]);
    button.classList.toggle("is-correct", isCorrect);
    button.classList.toggle("is-wrong", isWrong);
    button.disabled = answered;
    return button;
  }

  function renderQuestion(): void {
    const question = currentQuestion();
    const answered = answeredChoiceId !== null;
    const answerChoice = question.choices.find((choice) => choice.id === question.answerId);
    if (!answerChoice) {
      console.error("[typing:quiz] Answer missing from choices", { question });
      throw new Error(`Quiz answer is missing from choices: ${question.answerId}`);
    }

    countEl.textContent = `${questionIndex + 1}/${questions.length}`;
    const resultClass = answeredChoiceId === question.answerId ? "quiz-feedback is-correct" : "quiz-feedback is-wrong";
    const resultText = answeredChoiceId === question.answerId ? "せいかい！" : "ざんねん！";
    clear(stage);
    stage.append(
      el("div", { class: "quiz-prompt-label", text: "これは だれ/なにの こと？" }),
      el("div", { class: "quiz-question" }, renderRuby(question.prompt)),
      el("div", { class: "quiz-choices" }, question.choices.map((choice) => renderChoice(question, choice)))
    );

    if (answered) {
      stage.append(
        el("div", { class: resultClass }, [
          document.createTextNode(`${resultText} こたえは `),
          ruby(answerChoice.name, answerChoice.reading),
          document.createTextNode(" だよ")
        ]),
        el("button", {
          class: "big-button primary quiz-next",
          text: questionIndex + 1 >= questions.length ? "けっかを みる" : "つぎへ",
          onClick: goNext
        })
      );
    }
  }

  ctx.root.replaceChildren(screen);
  if (collectedEntries.length < QUIZ_CHOICE_COUNT) {
    renderShortage();
    return () => {};
  }

  questions = createQuizQuestions(collectedEntries);
  console.debug("[typing:quiz] start", { theme: collection.key, collected: collectedEntries.length, questions: questions.length });
  renderQuestion();
  return () => {};
}
