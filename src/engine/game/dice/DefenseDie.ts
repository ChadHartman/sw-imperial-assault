namespace SwiaEngine.Game.Dice {

    export interface IDefenseSide {
        block: number;
        evade: number;
        dodge: number;
        index: number;
    }

    export class DefenseDie {

        public readonly name: string;
        private readonly sides: Array<IDefenseSide>;

        constructor(name: string, sides: Array<IDefenseSide>) {
            this.name = name;
            this.sides = sides;
        }

        public roll(): IDefenseSide {
            let index = Math.floor(Math.random() * this.sides.length);
            return this.sides[index];
        }
    }

    export const BLACK = new DefenseDie(
        "black",
        [
            { block: 1, evade: 0, dodge: 0, index: 0 },
            { block: 1, evade: 0, dodge: 0, index: 1 },
            { block: 2, evade: 0, dodge: 0, index: 2 },
            { block: 2, evade: 0, dodge: 0, index: 3 },
            { block: 3, evade: 0, dodge: 0, index: 4 },
            { block: 0, evade: 1, dodge: 0, index: 5 }
        ]);

    export const WHITE = new DefenseDie(
        "white",
        [
            { block: 0, evade: 0, dodge: 0, index: 0 },
            { block: 1, evade: 0, dodge: 0, index: 1 },
            { block: 0, evade: 1, dodge: 0, index: 2 },
            { block: 1, evade: 1, dodge: 0, index: 3 },
            { block: 1, evade: 1, dodge: 0, index: 4 },
            { block: 0, evade: 0, dodge: 1, index: 5 }
        ]);
}