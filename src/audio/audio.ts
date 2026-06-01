// 音まわり。ことばの読み上げ（SpeechSynthesis）と効果音（Web Audio で生成、アセット0）。
// 機能が無いブラウザでは静かにスキップする（能力チェック。エラーの握りつぶしではない）。

export type SfxKind = "correct" | "wrong" | "hatch" | "clear";

interface Note {
  freq: number;
  at: number;
}

const SFX_NOTES: Record<SfxKind, Note[]> = {
  correct: [{ freq: 880, at: 0 }],
  wrong: [{ freq: 150, at: 0 }],
  hatch: [
    { freq: 523, at: 0 },
    { freq: 659, at: 0.09 },
    { freq: 784, at: 0.18 }
  ],
  clear: [
    { freq: 523, at: 0 },
    { freq: 659, at: 0.12 },
    { freq: 784, at: 0.24 },
    { freq: 1047, at: 0.36 }
  ]
};

export class GameAudio {
  private enabled: boolean;
  private ctx: AudioContext | null = null;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    console.debug("[typing:audio] enabled", { enabled });
  }

  // 戦国ことばは日本語の読み（ひらがな）を ja-JP で読み上げる。
  speak(text: string, lang = "ja-JP"): void {
    if (!this.enabled) return;
    if (!("speechSynthesis" in window)) {
      console.debug("[typing:audio] speechSynthesis not available");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  sfx(kind: SfxKind): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const start = ctx.currentTime;
    for (const note of SFX_NOTES[kind]) {
      this.playNote(ctx, note.freq, start + note.at, 0.14, kind === "wrong" ? "sawtooth" : "triangle");
    }
  }

  private ensureContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) {
        console.debug("[typing:audio] AudioContext not available");
        return null;
      }
      this.ctx = new Ctor();
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private playNote(
    ctx: AudioContext,
    freq: number,
    start: number,
    duration: number,
    type: OscillatorType
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }
}
