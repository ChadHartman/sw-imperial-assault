namespace App.Game.Engine.Validation {

    export interface ILine {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }

    export interface ILosResult {
        lines?: Array<ILine>;
        success: boolean;
    }

    export class LineOfSightValidator {

        private readonly state: GameState;

        constructor(state: GameState) {
            this.state = state;
        }

        public validate(s1: Space, s2: Space): ILosResult {

            for (let x = s1.x; x < s1.x + 1; x++) {
                for (let y = s1.y; y < s1.y + 1; y++) {
                    let lines = this.checkCorner(s1.x, s1.y, s2);

                    if (lines !== null && lines.length >= 2) {
                        return {
                            lines: lines,
                            success: true
                        };
                    }
                }
            }

            return { success: false };
        }

        private checkCorner(x: number, y: number, space: Space): Array<ILine> | null {
            let lines: Array<ILine> | null = null;
            for (let x = space.x; x < space.x + 1; x++) {
                for (let y = space.y; y < space.y + 1; y++) {
                    let line = this.checkLine(x, y, space.x, space.y);
                    if (line !== null) {
                        if (lines === null) {
                            lines = new Array<ILine>();
                        }
                        lines.push(line);
                    }
                }
            }
            return lines;
        }

        /**
         * +---+
         * |   |
         * +---+
         * 
         * 
         */

        private checkLine(x1: number, y1: number, x2: number, y2: number): ILine | null {
            // entry: x, y, angle
            // exit: x, y

            let line = new Line(x1, y1, x2, y2);

            let dx = x1 - x2;
            let dy = y1 - y2;
            let sx = dx / Math.abs(dx);
            let sy = dy / Math.abs(dy);

            for (let x = (x1 + sx); x != x2; x += sx) {
                // get y for x. if y is an integer, it's a corner, otherwise it's along a wall
            }

            for (let y = (y1 + sy); y != y2; y += sy) {
                // get x for y. if x is an integer, it's a corner, otherwise it's along a wall

            }

            return null;
        }


    }
}