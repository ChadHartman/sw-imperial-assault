namespace SwiaEngine.Game {

    export class Group {
        public readonly units: Array<Unit>;
        public readonly id: number;
        public readonly zoneColor: ZoneColor;
        public readonly uniqueId: string;

        constructor(id: number, zoneColor: ZoneColor) {
            this.units = new Array<Unit>();
            this.id = id;
            this.zoneColor = zoneColor;
            this.uniqueId = `${ZoneColor[zoneColor]}.${id}`;
        }

        public get state(): ActivationState {
            let state = this.units[0].state;

            for (let i = 1; i < this.units.length; i++) {
                if (state !== this.units[i].state) {
                    // Mix of ready, active, and exausted
                    return ActivationState.ACTIVE;
                }
            }

            return state;
        }

        public activate(firstUnitId: number) {
            for (let unit of this.units) {
                unit.state = unit.id === firstUnitId ?
                    ActivationState.ACTIVE : ActivationState.ACTIVE_WAITING;
            }
        }

        public ready() {
            for (let unit of this.units) {
                unit.state = ActivationState.READY;
            }
        }

        public getUnit(id: number): Unit {
            for (let unit of this.units) {
                if (unit.id === id) {
                    return unit;
                }
            }
            throw new Error('No unit with id: ${id}');
        }

        public get exausted() {
            return this.state === ActivationState.EXAUSTED;
        }

        public get active() {
            return this.state === ActivationState.ACTIVE;
        }

        public get activeUnit(): Unit | null {
            for (let unit of this.units) {
                if (unit.active) {
                    return unit;
                }
            }
            return null;
        }
    }
}