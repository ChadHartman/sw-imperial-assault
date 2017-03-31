namespace App.Ng {

    export class StateCache {
        public static readonly NAME = "stateCache";
        private static readonly LS_KEY = "game_state";

        public readonly states: Array<StateCache.ISkirmishState>;
        private readonly stateCollection: StateCache.IStateCollection;

        constructor() {
            if (StateCache.LS_KEY in localStorage) {
                this.stateCollection = JSON.parse(localStorage[StateCache.LS_KEY]);
            } else {
                this.stateCollection = {
                    __last_id__: 1,
                    states: []
                };
            }

            this.states = this.stateCollection.states;
        }

        public save(gameState: Game.Engine.GameState) {

            let unitStates = new Array<StateCache.IUnitState>();
            let state = {
                id: this.stateCollection.__last_id__++,
                skirmish_id: gameState.skirmish.id,
                units: unitStates,
                round: gameState.round,
                initiative: Game.ZoneColor[gameState.initiative],
                timestamp: Date.now()
            };

            for (let army of gameState.armies) {
                switch (army.zoneColor) {
                    case Game.ZoneColor.RED:
                        state["red"] = army.id;
                        break;
                    case Game.ZoneColor.BLUE:
                        state["blue"] = army.id;
                        break;
                    default:
                        throw new Error(`Unknown zone color: ${army.zoneColor}`);
                }

                for (let unit of army.units) {
                    unitStates.push(this.createUnitState(unit));
                }
            }

            this.stateCollection.states.push(state);
            this.persistCache();
        }

        public load(stateId: number, gameState: Game.Engine.GameState) {
            let state = this.getState(stateId);
            for (let unitState of state.units) {
                let unit = gameState.unit(unitState.unique_id);
                unit.movementPoints = unitState.movement_points;
                unit.state = Game.ActivationState[unitState.state];
                unit.x = unitState.x;
                unit.y = unitState.y;
            }
        }

        private getState(id: number): StateCache.ISkirmishState {
            for (let state of this.states) {
                if (state.id === id) {
                    return state;
                }
            }
            throw new Error(`No state with id: ${id}`);
        }

        private createUnitState(unit: Game.Unit): StateCache.IUnitState {
            return {
                unique_id: unit.uniqueId,
                movement_points: unit.movementPoints,
                x: unit.x,
                y: unit.y,
                state: Game.ActivationState[unit.state]
            };
        }

        private persistCache() {
            localStorage[StateCache.LS_KEY] = JSON.stringify(this.stateCollection);
        }
    }

    export module StateCache {

        export interface IArmy {
            id: number;
            color: string;
        }

        export interface IUnitState {
            unique_id: string;
            movement_points: number;
            x: number;
            y: number;
            state: string;
        }

        export interface ISkirmishState {
            id: number;
            skirmish_id: string;
            initiative: string;
            units: Array<IUnitState>;
            round: number;
            red?: number;
            blue?: number;
            timestamp: number;
        }

        export interface IStateCollection {
            __last_id__: number;
            readonly states: Array<ISkirmishState>;
        }
    }
}

App.Ng.module.factory(App.Ng.StateCache.NAME, [
    function () {
        return new App.Ng.StateCache();
    }]
);