/**
 * Core Countdown Engine
 * Uses pure performance requestAnimationFrame to hit minimal battery drain on idle loops.
 */
export class CountdownEngine {
  constructor(targetDateIso, onTickCallback) {
    this.target = new Date(targetDateIso).getTime();
    this.onTickCallback = onTickCallback;
    this.animationFrameId = null;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.tick();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  tick = () => {
    if (!this.isRunning) return;

    const now = Date.now();
    const diff = this.target - now;

    if (diff <= 0) {
      // Reached 0
      this.onTickCallback({ days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0, isFinished: true });
      this.stop();
      return;
    }

    const state = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      ms: diff % 1000,
      isFinished: false
    };

    this.onTickCallback(state);
    
    // Smooth next tick
    this.animationFrameId = requestAnimationFrame(this.tick);
  }
}
