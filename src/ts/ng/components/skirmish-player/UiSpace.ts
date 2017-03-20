namespace App.Ng.SkirmishPlayer {

    class Neighbors {
        aboveLeft: UiSpace | null;
        above: UiSpace | null;
        aboveRight: UiSpace | null;
        right: UiSpace | null;
        belowRight: UiSpace | null;
        below: UiSpace | null;
        belowLeft: UiSpace | null;
        left: UiSpace | null;


    }

    /**
     * Container for holding source data and rendering info.
     * 
     */
    export class UiSpace {

        public readonly space: Game.Space;
        private readonly neighbors: Array<UiSpace>;
        private readonly state: Game.Engine.GameState;
        private _points: number | null;

        constructor(space: Game.Space, state: Game.Engine.GameState) {
            this.space = space;
            this.state = state;
            this.neighbors = new Array<UiSpace>();
            this._points = null;
        }

        public populateNeighbors(spaces: Array<UiSpace>) {
            let x = this.space.x;
            let y = this.space.y;

            this.addNeighbor(UiUtils.findSpace(x + 1, y, spaces));

            this.addNeighbor(UiUtils.findSpace(x, y - 1, spaces));
            this.addNeighbor(UiUtils.findSpace(x + 1, y - 1, spaces));
            this.addNeighbor(UiUtils.findSpace(x - 1, y - 1, spaces));

            this.addNeighbor(UiUtils.findSpace(x - 1, y, spaces));

            this.addNeighbor(UiUtils.findSpace(x, y + 1, spaces));
            this.addNeighbor(UiUtils.findSpace(x + 1, y + 1, spaces));
            this.addNeighbor(UiUtils.findSpace(x - 1, y + 1, spaces));
        }

        private addNeighbor(neighbor: UiSpace | null) {
            if (neighbor === null) {
                return;
            }
            this.neighbors.push(neighbor);
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

                if (!this.state.accessible(
                    this.space.x, this.space.y,
                    neighbor.space.x, neighbor.space.y)) {
                    continue;
                }

                if (neighbor.points === null || neighbor.points < nValue) {
                    neighbor.points = nValue;
                }
            }
        }

    }
}