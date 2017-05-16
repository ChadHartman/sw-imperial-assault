namespace SwiaEngine.Game {
    export class Line {
        public readonly m: number;
        public readonly b: number;
        public readonly x1: number;
        public readonly y1: number;
        public readonly x2: number;
        public readonly y2: number;
        private readonly xMin: number;
        private readonly yMin: number;
        private readonly xMax: number;
        private readonly yMax: number;

        constructor(x1: number, y1: number, x2: number, y2: number) {

            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;

            this.xMin = x1 < x2 ? x1 : x2;
            this.yMin = y1 < y2 ? y1 : y2;
            this.xMax = x1 > x2 ? x1 : x2;
            this.yMax = y1 > y2 ? y1 : y2;

            // Produces Infinity for vertical lines
            this.m = (y2 - y1) / (x2 - x1);
            if (this.m === -Infinity) {
                this.m = Infinity;
            }
            // y = mx + b
            // y - mx = b
            this.b = y1 - (this.m * x1);
            if (this.b === -Infinity) {
                this.b = Infinity;
            }
        }

        public interects(line: Line): boolean {
            if (this.m === line.m) {
                // Intersects infinitely or not at all
                return this.b === line.b;
            }

            if (this.m === Infinity) {
                // This line is vertical, x1 and x2 are the same
                let x = this.x1;
                let y = line.yGivenX(x);
                return this.inBounds(x, y);
            }

            if (line.m === Infinity) {
                let x = line.x1;
                let y = this.yGivenX(x);
                return this.inBounds(x, y);
            }

            // Different slopes
            // y = mx + b
            // m1x + b1 = m2x + b2
            // m1x = m2x + b2 - b1
            // m1x - m2x = b2 - b1
            // x(m1 - m2) = b2 - b1
            // x = (b2 - b1) / (m1 - m2)
            let x = (line.b - this.b) / (line.m - this.m);
            let y = this.yGivenX(x);

            return this.inBounds(x, y);
        }

        private inBounds(x:number, y:number) {
            return this.xMin < x && x < this.xMax && this.yMin < y && y < this.yMax;
        }

        public yGivenX(x: number): number {
            // y = mx + b
            return (this.m * x) + this.b;
        }

        public xGivenY(y: number): number {
            // y = mx + b
            // y - b  = mx
            // (y - b) / m  = x
            return (y - this.b) / this.m;
        }
    }
}