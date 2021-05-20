import * as bezier from 'bezier-easing';


const SCHEDULER = {
    subscriptions: new Set(),
    subscribe (callback: Function) {
        this.subscriptions.add(callback);
        return () => this.subscriptions.delete(callback);
    },
    emit () {
        for (let callback of this.subscriptions) {
            callback();
        }
    }
};

export class DynamicValue extends Number {
    static tick (): void {
        SCHEDULER.emit();
    }

    readonly #startValue: number;
    readonly #time: number;
    readonly #bezierString: string;
    #currentValue: number;
    #targetValue: number = null;
    #loopStarted = false;
    #stopLoop: () => void = null;

    constructor (value: number = 0, time: number, bezierString: string) {
        super(value);
        this.#startValue = value;
        this.#currentValue = value;
        this.#time = time;
        this.#bezierString = bezierString;
    }

    transformTo (newValue: number, sameCycle = false): this {
        if (!sameCycle) {
            this.reset(this.#currentValue);
        }
        this.#targetValue = newValue;
        if (!this.#loopStarted) {
            this.#loopStarted = true;
            this.#stopLoop = easingLoop(this.#time, this.#bezierString, k => {
                this.#currentValue = this.#startValue + (this.#targetValue - this.#startValue) * k;
                if (k === 1) {
                    this.reset(newValue);
                }
            });
        }
        return this;
    }

    reset (startValue= this.#startValue): void {
        if (typeof this.#stopLoop === 'function') {
            this.#stopLoop();
            this.#stopLoop = null;
        }
        this.#currentValue = startValue;
        this.#targetValue = null;
        this.#loopStarted = false;
    }

    current (): number {
        return this.#currentValue;
    }

}

export function easingLoop (time: number, bezierString: string, callback: (easingValue: number, progress: number) => void): () => void {
    let easing = bezier(...(bezierString.split(/,\s*/).map(v => Number(v)) as [number, number, number, number]));
    return timeLoop(time, progress => callback(easing(progress), progress));
}

export function timeLoop (durationMs: number, callback: (progress: number) => void): () => void {
    let start = Date.now(),
        end = start + durationMs,
        unsubscribe = SCHEDULER.subscribe(() => {
            let now = Date.now();
            if (now <= end) {
                callback((now - start) / durationMs);
            } else {
                unsubscribe();
            }
        });
    return () => unsubscribe();
}
