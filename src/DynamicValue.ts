import bezier from 'bezier-easing';

export class DynamicValue extends Number {

  private static SCHEDULER = {
    subscriptions: new Set<CallableFunction>(),
    subscribe(callback: CallableFunction) {
      this.subscriptions.add(callback);

      return () => this.subscriptions.delete(callback);
    },
    emit() {
      for (let callback of this.subscriptions) {
        callback();
      }
    }
  } as const;

  static tick(): void {
    this.SCHEDULER.emit();
  }

  readonly time: number;
  readonly bezierString: string;
  private startValue: number;
  private currentValue: number;
  private targetValue: number | null = null;
  private stopLoop: (() => void) | null = null;

  constructor(value: number = 0, time: number, bezierString: string) {
    super(value);
    this.startValue = value;
    this.currentValue = value;
    this.time = time;
    this.bezierString = bezierString;
  }

  transitionTo(newValue: number): this {
    this.reset(this.currentValue);
    this.targetValue = newValue;
    this.stopLoop = this.easingLoop(easingValue => {
      this.currentValue = this.startValue + (this.targetValue! - this.startValue) * easingValue;

      if (easingValue === 1) {
        this.reset(newValue);
      }
    });

    return this;
  }

  reset(startValue: number = this.startValue): void {
    if (this.stopLoop) {
      this.stopLoop();
      this.stopLoop = null;
    }

    this.currentValue = startValue;
    this.startValue = startValue;
    this.targetValue = null;
  }

  current(): number {
    return this.currentValue;
  }

  [Symbol.toPrimitive](): number {
    return this.current();
  }

  valueOf(): number {
    return this.current();
  }

  private easingLoop(callback: (easingValue: number, progress: number) => void): () => void {
    let timeMs = this.time;
    let bezierString = this.bezierString;
    let bezierParams = bezierString.split(/,\s*/).map(v => Number(v));
    let easing = bezier(...bezierParams as [number, number, number, number]);

    return this.timeLoop(timeMs, progress => callback(easing(progress), progress));
  }

  private timeLoop(durationMs: number, callback: (progress: number) => void): () => void {
    let start = Date.now();
    let end = start + durationMs;
    let unsubscribe = DynamicValue.SCHEDULER.subscribe(() => {
      let now = Date.now();

      if (now <= end) {
        callback((now - start) / durationMs);
      } else {
        callback(1);
        unsubscribe();
      }
    });

    return () => unsubscribe();
  }

}
