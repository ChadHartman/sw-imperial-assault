namespace SwiaEngine.Game.Engine.Util {

    export class LosService {
        private readonly state: GameState;

        constructor(state: GameState) {
            this.state = state;
        }

        public los(from: Unit, to: Unit): ILosResult {
            for (let x = from.x; x <= from.x + 1; x++) {
                for (let y = from.y; y <= from.y + 1; y++) {
                    let lines = this.cornerToSpaceLos(x, y, to);
                    if (lines !== null) {
                        return {
                            success: true,
                            lines: lines
                        };
                    }
                }
            }
            return failure("No los found");
        }

        private cornerToSpaceLos(x1: number, y1: number, to: Unit): Array<ILosLine> | null {

            let lines: Array<ILosLine> | null = null;

            for (let x2 = to.x; x2 <= to.x + 1; x2++) {
                for (let y2 = to.y; y2 <= to.y + 1; y2++) {

                    let line = this.cornerToCornerLos(x1, y1, x2, y2);
                    if (line !== null) {
                        if (lines === null) {
                            lines = new Array<ILosLine>();
                        }
                        lines.push(line);
                    }
                }
            }

            return lines !== null && lines.length > 1 ? lines : null;
        }

        private cornerToCornerLos(x1: number, y1: number, x2: number, y2: number): ILosLine | null {
            // TODO: implement
            return {
                fromX: x1,
                fromY: y1,
                toX: x2,
                toY: y2
            };
        }
    }
}