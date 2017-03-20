namespace App.Util {
    export class Animator {

        private readonly min: number;
        private readonly max: number;
        private readonly range: number;
        private readonly duration: number;
        private readonly doesReverse;
        private lastValue: number;
        private lastTime: number;
        private isPositive: boolean;

        /**
         * @param min - minimum inclusive value
         * @param max - max-mum inclusive value
         * @param duraation - in milliseconds
         * @param reverses - true if the animtaion should progress in the other direstion
         * 
         */
        constructor(min: number, max: number, duration: number, reverse: boolean) {
            this.min = min;
            this.max = max;
            this.duration = duration;
            this.range = max - min;
            this.doesReverse = reverse;
            this.isPositive = true;
        }

        public next(): number {
            let now = Date.now();
            let delta = now - this.lastTime;
            let progress = delta / this.duration;
            let step = progress * this.range;
            var value = this.lastValue + (this.isPositive ? step : -step);

            if (value < this.min) {
                if (this.doesReverse) {
                    value = this.min;
                    this.isPositive = true;
                } else {
                    value = this.max;
                }
            } else if (value > this.max) {
                if (this.doesReverse) {
                    value = this.max;
                    this.isPositive = false;
                } else {
                    value = this.min;
                }
            }

            this.lastValue = value;
            this.lastTime = now;

            return value;
        }

        public start() {
            this.lastValue = this.min;
            this.isPositive = true;
            this.lastTime = Date.now();
        }

        public get isStarted(): boolean {
            return this.lastTime ? true : false;
        }

        public pause() {
            delete this.lastTime;
        }
    }
}