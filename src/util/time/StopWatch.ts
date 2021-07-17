import { isBrowser } from 'browser-or-node';

export class StopWatch {
  private startTime: number;
  private endTime: number | null = null;

  constructor() {
    this.startTime = this.getCurrentTime();
  }

  start() {
    this.startTime = this.getCurrentTime();
    this.endTime = null;
  }

  end() {
    this.endTime = this.getCurrentTime();
  }

  elapsedMillis(): number {
    return (this.endTime ?? this.getCurrentTime()) - this.startTime;
  }

  elapsedSecondsFixed(digits: number = 0): string {
    return (this.elapsedMillis() / 1000).toFixed(digits);
  }

  private getCurrentTime(): number {
    let currentTime;
    if (isBrowser) {
      currentTime = performance.now();
    } else {
      currentTime = Date.now();
    }
    return currentTime;
  }
}
