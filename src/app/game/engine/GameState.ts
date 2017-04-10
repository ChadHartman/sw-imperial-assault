namespace App.Game.Engine {

    function armySorter(a: Army, b: Army): number {
        return a.zoneColor - b.zoneColor;
    }

    /**
     * Should never mutate itself
     */
    export class GameState {
        public readonly armies: Array<Army>;
        public readonly skirmish: Skirmish;
        public readonly initiative: ZoneColor;
        public readonly losService: Util.LosService;
        public round: number;

        constructor(skirmish: Skirmish, armies: Array<Army>, initiative: ZoneColor) {
            this.skirmish = skirmish;
            this.armies = armies;
            this.armies.sort(armySorter);
            this.initiative = initiative;
            this.round = 1;
            this.losService = new Util.LosService(this);
        }

        public get activeUnit(): Unit | null {
            for (let army of this.armies) {
                for (let unit of army.units) {
                    if (unit.state === ActivationState.ACTIVE) {
                        return unit;
                    }
                }
            }
            return null;
        }

        public get activeGroup(): Group | null {
            for (let army of this.armies) {
                for (let group of army.groups) {
                    if (group.state === ActivationState.ACTIVE) {
                        return group;
                    }
                }
            }
            return null;
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

        public group(zoneColor: ZoneColor, groupId: number): Group {
            for (let army of this.armies) {
                if (army.zoneColor !== zoneColor) {
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

        public army(zoneColor: ZoneColor): Army {
            for (let army of this.armies) {
                if (army.zoneColor === zoneColor) {
                    return army;
                }
            }
            throw new Error(`No army of Zone: ${ZoneColor[zoneColor]}`);
        }

        public exaustedGroups(zoneColor: ZoneColor): Array<Group> {
            let groups = new Array<Group>();
            let army = this.army(zoneColor);
            for (let group of army.groups) {
                if (group.exausted) {
                    groups.push(group);
                }
            }
            return groups;
        }

        public get activeZone(): ZoneColor {


            let roundInitiative = this.round % this.armies.length;


            return ZoneColor.RED;
        }

        public los(from: Unit, to: Unit): ILosResult {
            return this.losService.los(from, to);
        }

        public distance(from:Unit, to:Unit) :number {
            // TODO: implement:
            return 20;
        }
    }
}