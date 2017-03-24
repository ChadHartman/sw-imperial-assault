namespace App.Ng {

    interface IArmy {
        id: number;
        color: string;
    }

    interface IUnitState {
        unique_id: string;
        movement_points: number;
        x: number;
        y: number;
        state: Game.ActivationState;
    }

    export interface ISkirmishState {
        id: number;
        skirmish_id: string;
        red?: number;
        blue?: number;
        units: Array<IUnitState>;
        round: number;
        timestamp: number;
    }

    interface IStateCollection {
        __last_id__: number;
        readonly states: Array<ISkirmishState>;
    }

    export class StateCache {
        public static readonly NAME = "stateCache";
        private static readonly LS_KEY = "game_state";

        public readonly states: Array<ISkirmishState>;
        private readonly stateCollection: IStateCollection;

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

            let unitStates = new Array<IUnitState>();
            let state = {
                id: this.stateCollection.__last_id__++,
                skirmish_id: gameState.skirmish.id,
                units: unitStates,
                round: gameState.round,
                timestamp: Date.now()
            };

            for (let army of gameState.armies) {
                state[army.color] = army.id;

                for (let unit of army.units) {
                    unitStates.push(this.createUnitState(unit));
                }
            }

            this.stateCollection.states.push(state);
            this.persistCache();
        }

        public load(stateId: number, gameState: Game.Engine.GameState) {

        }

        private createUnitState(unit: Game.Unit): IUnitState {
            return {
                unique_id: unit.uniqueId,
                movement_points: unit.movementPoints,
                x: unit.x,
                y: unit.y,
                state: unit.state
            };
        }

        private persistCache() {
            localStorage[StateCache.LS_KEY] = JSON.stringify(this.stateCollection);
        }
    }
}

App.Ng.module.factory(App.Ng.StateCache.NAME, [
    function () {
        return new App.Ng.StateCache();
    }]
);