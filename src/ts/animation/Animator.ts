namespace App.Animation {

    export class Animator {

        public doesReverse: boolean;
        public infinite: boolean;

        private readonly initial: number;
        private readonly destination: number;
        private readonly min: number;
        private readonly max: number;
        private readonly range: number;
        private readonly duration: number;
        private lastValue: number;
        private lastTime: number | null;
        private isPositive: boolean;

        /**
         * @param min - minimum inclusive value
         * @param max - max-mum inclusive value
         * @param duration - in milliseconds
         * 
         */
        constructor(initial: number, destination: number, duration: number) {

            this.initial = initial;
            this.destination = destination;
            this.min = initial < destination ? initial : destination;
            this.max = initial < destination ? destination : initial;
            this.duration = duration;
            this.range = Math.abs(destination - initial);
            this.doesReverse = false;
            this.infinite = false;
            this.lastTime = null;
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

            if (!this.infinite && value === this.destination) {
                // only hits one of the endpoints 
                this.stop();
            }

            return value;
        }

        public start() {
            this.lastValue = this.initial;
            this.isPositive = (this.destination - this.initial) >= 0;
            this.lastTime = Date.now();
        }

        public get running(): boolean {
            return this.lastTime === null ? false : true;
        }

        public stop() {
            this.lastTime = null;
        }
    }
}