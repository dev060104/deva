// Synthesized Web Audio Engine for 3D Birthday Experience
// 100% self-contained, zero external network requests or audio file dependencies

class BirthdaySoundEngine {
  private ctx: AudioContext | null = null;
  private melodyTimer: any = null;
  private isMelodyPlaying: boolean = false;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMelody();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft sparkle / magical chime
  public playChime(freq = 880, duration = 0.8) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Unboxing pop & magical crescendo
  public playUnboxFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Pop sound
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(140, ctx.currentTime);
      popOsc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);

      popGain.gain.setValueAtTime(0.4, ctx.currentTime);
      popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start();
      popOsc.stop(ctx.currentTime + 0.15);

      // Sparkling ascending chord arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((note, idx) => {
        const time = ctx.currentTime + 0.08 * idx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, time);

        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.9);
      });
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  // Candle blow puff with white noise simulation & hiss
  public playBlowPuff() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // White noise buffer
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.4);
      filter.Q.value = 3;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  // Cake slicing swoosh & cream cut sound
  public playCakeSlice() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // 1. Blade slice whoosh (Filtered noise)
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.25);
      filter.Q.value = 4;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.25);

      // 2. Sweet cream slide tone
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, ctx.currentTime + 0.05);
      osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.35);

      oscGain.gain.setValueAtTime(0.2, ctx.currentTime + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(ctx.currentTime + 0.05);
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  // Celebratory Party Fanfare
  public playCheer() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const fanfare = [
        { f: 261.63, d: 0.15, delay: 0 },
        { f: 392.00, d: 0.15, delay: 0.15 },
        { f: 523.25, d: 0.2, delay: 0.3 },
        { f: 659.25, d: 0.2, delay: 0.45 },
        { f: 783.99, d: 0.5, delay: 0.65 },
      ];

      fanfare.forEach((n) => {
        const time = ctx.currentTime + n.delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, time);

        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + n.d);
      });
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  // Melodic Music-Box "Happy Birthday" Tune
  public playMelody(loop = false) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopMelody();
    this.isMelodyPlaying = true;

    const melody: [number, number][] = [
      [261.63, 0.35], [261.63, 0.25], [293.66, 0.5], [261.63, 0.5], [349.23, 0.5], [329.63, 0.9],
      [261.63, 0.35], [261.63, 0.25], [293.66, 0.5], [261.63, 0.5], [392.00, 0.5], [349.23, 0.9],
      [261.63, 0.35], [261.63, 0.25], [523.25, 0.5], [440.00, 0.5], [349.23, 0.5], [329.63, 0.5], [293.66, 0.8],
      [466.16, 0.35], [466.16, 0.25], [440.00, 0.5], [349.23, 0.5], [392.00, 0.5], [349.23, 1.2],
    ];

    let currentDelay = 0;
    melody.forEach(([freq, dur]) => {
      const time = ctx.currentTime + currentDelay;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.0005, time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + dur);
      } catch {
        // ignore
      }
      currentDelay += dur * 0.95;
    });

    if (loop) {
      this.melodyTimer = setTimeout(() => {
        if (this.isMelodyPlaying && !this.isMuted) {
          this.playMelody(true);
        }
      }, (currentDelay + 1) * 1000);
    } else {
      this.melodyTimer = setTimeout(() => {
        this.isMelodyPlaying = false;
      }, (currentDelay + 0.5) * 1000);
    }
  }

  public stopMelody() {
    this.isMelodyPlaying = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isMelodyPlaying;
  }
}

export const birthdayAudio = new BirthdaySoundEngine();
