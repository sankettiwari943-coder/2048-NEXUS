export class SoundEngine {
  private static audioCtx: AudioContext | null = null;
  private static musicOscillator: OscillatorNode | null = null;
  private static musicGainNode: GainNode | null = null;
  private static isMusicPlaying = false;

  private static getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!SoundEngine.audioCtx) {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        SoundEngine.audioCtx = new AudioCtxClass();
      }
    }
    if (SoundEngine.audioCtx && SoundEngine.audioCtx.state === 'suspended') {
      SoundEngine.audioCtx.resume();
    }
    return SoundEngine.audioCtx;
  }

  /**
   * Plays a premium AAA startup sound chime
   */
  public static playStartup(volume = 0.6): void {
    const ctx = SoundEngine.getContext();
    if (!ctx) return;

    try {
      const frequencies = [220, 330, 440, 660, 880];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2 * volume, ctx.currentTime + idx * 0.08 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.6);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Subtle hover sound tick
   */
  public static playHover(volume = 0.2): void {
    const ctx = SoundEngine.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.02);

      gain.gain.setValueAtTime(0.05 * volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Plays a subtle swipe sound effect
   */
  public static playMove(volume = 0.5): void {
    const ctx = SoundEngine.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15 * volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Plays a pleasant harmonic chime when tiles merge, scaled by tile value!
   */
  public static playMerge(tileValue: number, volume = 0.5): void {
    const ctx = SoundEngine.getContext();
    if (!ctx) return;

    try {
      const baseFreq = 261.63; // C4
      const exponent = Math.min(10, Math.log2(tileValue || 2));
      const freq = baseFreq * Math.pow(1.12, exponent);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3 * volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Plays a crisp button click sound
   */
  public static playClick(volume = 0.5): void {
    const ctx = SoundEngine.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.1 * volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Triumphant Victory sound fanfare
   */
  public static playWin(volume = 0.5): void {
    const ctx = SoundEngine.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.25 * volume, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + idx * 0.1 + 0.3
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.3);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Game Over descending chime
   */
  public static playGameOver(volume = 0.5): void {
    const ctx = SoundEngine.getContext();
    if (!ctx) return;

    try {
      const notes = [400, 350, 300, 220];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.2 * volume, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + idx * 0.12 + 0.25
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.25);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Toggle background procedural ambient synth music
   */
  public static toggleAmbientMusic(enable: boolean, volume = 0.3): void {
    const ctx = SoundEngine.getContext();
    if (!ctx) return;

    if (!enable) {
      if (SoundEngine.musicGainNode) {
        SoundEngine.musicGainNode.gain.linearRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.5
        );
        setTimeout(() => {
          SoundEngine.musicOscillator?.stop();
          SoundEngine.musicOscillator?.disconnect();
          SoundEngine.musicOscillator = null;
          SoundEngine.isMusicPlaying = false;
        }, 500);
      }
      return;
    }

    if (SoundEngine.isMusicPlaying) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05 * volume, ctx.currentTime + 1.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      SoundEngine.musicOscillator = osc;
      SoundEngine.musicGainNode = gain;
      SoundEngine.isMusicPlaying = true;
    } catch {
      // Audio fallback
    }
  }
}
