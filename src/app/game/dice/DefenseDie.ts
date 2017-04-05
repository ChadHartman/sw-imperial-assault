namespace App.Game.Dice {

    export interface IDefenseSide {
        block: number;
        evade: number;
        dodge: number;
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
        "block",
        [
            { block: 1, evade: 0, dodge: 0 },
            { block: 1, evade: 0, dodge: 0 },
            { block: 2, evade: 0, dodge: 0 },
            { block: 2, evade: 0, dodge: 0 },
            { block: 3, evade: 0, dodge: 0 },
            { block: 0, evade: 1, dodge: 0 }
        ]);

    export const WHITE = new DefenseDie(
        "white",
        [
            { block: 0, evade: 0, dodge: 0 },
            { block: 1, evade: 0, dodge: 0 },
            { block: 0, evade: 1, dodge: 0 },
            { block: 1, evade: 1, dodge: 0 },
            { block: 1, evade: 1, dodge: 0 },
            { block: 0, evade: 0, dodge: 1 }
        ]);
}