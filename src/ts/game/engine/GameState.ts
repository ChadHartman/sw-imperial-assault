namespace App.Game.Engine {

    /**
     * Should never mutate itself
     */
    export class GameState {
        public readonly armies: Array<Army>;
        public activeGroup: Group | null;
        public activeArmyIndex: number;
        public round: number;
        public skirmish: Skirmish;

        constructor() {
            this.armies = new Array<Army>();
            this.round = 1;
            this.activeGroup = null;
            this.activeArmyIndex = 0;
        }

        public unit(id: string): Game.Unit {
            for (let army of this.armies) {
                for (let unit of army.units) {
                    if (unit.uniqueId === id) {
                        return unit;
                    }
                }
            }
            throw new Error(`No unit with id ${id}.`);
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
            if (!this.skirmish) {
                return null;
            }
            return Util.findSpace(x, y, this.skirmish.spaces);
        }

        public unitAt(x: number, y: number): Unit | null {
            for (let army of this.armies) {
                for (let unit of army.units) {
                    if (unit.x === x && unit.y === y) {
                        return unit;
                    }
                }
            }
            return null;
        }

        public occupied(x: number, y: number): boolean {
            return this.unitAt(x, y) !== null;
        }

        public get activeArmy(): Army {
            return this.armies[this.activeArmyIndex];
        }
    }
}