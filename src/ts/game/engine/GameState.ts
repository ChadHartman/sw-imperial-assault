namespace App.Game.Engine {

    /**
     * Should never mutate itself
     */
    export class GameState {
        public readonly armies: Array<Army>;
        public activeGroup: Group | null;
        public activeArmyIndex: number;
        public round: number;
        private _skirmish: Skirmish;
        private spaceAccessChecker: State.SpaceAccessibilityService;

        constructor() {
            this.armies = new Array<Army>();
            this.round = 1;
            this.activeGroup = null;
            this.activeArmyIndex = 0;
        }

        public get skirmish(): Skirmish {
            return this._skirmish;
        }

        public set skirmish(value: Skirmish) {
            this._skirmish = value;
            this.spaceAccessChecker = new State.SpaceAccessibilityService(value.spaces);
        }

        public group(armyColor: String, groupId: number): Group {
            for (let army of this.armies) {
                if (army.color !== armyColor) {
                    continue;
                }
                for (let group of army.groups) {
                    if (group.id === groupId) {
                        return group;
                    }
                }
            }
            throw new Error(`No group found with id: ${groupId}`);
        }

        public space(x: number, y: number): Space | null {
            if (!this._skirmish) {
                return null;
            }
            return State.findSpace(x, y, this._skirmish.spaces);
        }

        public unit(x: number, y: number): Unit | null {
            for (let army of this.armies) {
                for (let unit of army.units) {
                    if (unit.x === x && unit.y === y) {
                        return unit;
                    }
                }
            }
            return null;
        }

        public get activeArmy(): Army {
            return this.armies[this.activeArmyIndex];
        }

        public accessible(x1: number, y1: number, x2: number, y2: number): boolean {
            return !this.spaceAccessChecker ? false :
                this.spaceAccessChecker.accessible(x1, y1, x2, y2);
        }
    }
}