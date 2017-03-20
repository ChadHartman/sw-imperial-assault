namespace App.Ng.SkirmishPlayer {

    /**
     * Container for holding source data and rendering info.
     * 
     */
    export class UiSpace {

        public readonly space: Game.Space;
        private readonly neighbors: Array<UiSpace>;
        private _points: number | null;

        constructor(space: Game.Space) {
            this.space = space;
            this.neighbors = new Array<UiSpace>();
            this._points = null;
        }

        public populateNeighbors(spaces: Array<Game.Space>, uiSpaces: Array<UiSpace>) {
            let x1 = this.space.x;
            let y1 = this.space.y;

            for (let y2 = y1 - 1; y2 <= y1 + 1; y2++) {
                for (let x2 = x1 - 1; x2 <= x1 + 1; x2++) {
                    if (y2 === y1 && x2 === x1) {
                        continue;
                    }
                    if (Game.Engine.Util.accessible(x1, y1, x2, y2, spaces)) {
                        this.neighbors.push(UiUtils.findSpace(x2, y2, uiSpaces) !);
                    }
                }
            }
        }

        /**
         * Movement points remaining after entering this space
         * 
         */
        public get points(): number | null {
            return this._points;
        }

        public set points(value: number | null) {

            if (value === null) {
                this._points = null;
                return;
            }

            this._points = value;

            let nValue = value - 1;
            if (nValue < 0) {
                return;
            }

            for (let neighbor of this.neighbors) {
                if (neighbor.points === null || neighbor.points < nValue) {
                    neighbor.points = nValue;
                }
            }
        }
    }
}