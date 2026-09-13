/**
 * Realistic luxury watch mechanical escapement sound generator using Web Audio API.
 * Synthesizes the acoustic impulse of a Swiss pallet fork jewel striking the escape wheel.
 */
class HorologyAudio {
  private ctx: AudioContext | null = null;
  private isMuted = true;
  private intervalId: number | null = null;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.init();
      this.startTicking();
    } else {
      this.stopTicking();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public playSingleTick(isTock = false) {
    if (this.isMuted || !this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // High resonance impulse: 4200Hz - 4800Hz click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isTock ? 4150 : 4480, t);
      osc.frequency.exponentialRampToValueAtTime(isTock ? 1200 : 1400, t + 0.012);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.016);
    } catch {
      // Ignore audio context errors if browser blocked
    }
  }

  private startTicking() {
    if (this.intervalId) return;
    let flip = false;
    // 4Hz = 28,800 vph = 250ms per half-oscillation beat
    this.intervalId = window.setInterval(() => {
      this.playSingleTick(flip);
      flip = !flip;
    }, 250);
  }

  private stopTicking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const horologyAudio = new HorologyAudio();
