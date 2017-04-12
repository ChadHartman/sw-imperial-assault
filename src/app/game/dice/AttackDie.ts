namespace App.Game.Dice {

    export interface IAttackSide {
        index: number;
        damage: number;
        surge: number;
        range: number;
    }

    export class AttackDie {

        constructor(
            public readonly name: string,
            private readonly sides: Array<IAttackSide>
        ) { }

        public roll(): IAttackSide {
            let index = Math.floor(Math.random() * this.sides.length);
            return this.sides[index];
        }
    }

    export const RED = new AttackDie(
        "red",
        [
            { damage: 1, surge: 0, range: 0, index: 0 },
            { damage: 2, surge: 0, range: 0, index: 1 },
            { damage: 2, surge: 0, range: 0, index: 2 },
            { damage: 2, surge: 1, range: 0, index: 3 },
            { damage: 3, surge: 0, range: 0, index: 4 },
            { damage: 3, surge: 0, range: 0, index: 5 }
        ]);

    export const BLUE = new AttackDie(
        "blue",
        [
            { damage: 0, surge: 1, range: 2, index: 0 },
            { damage: 1, surge: 0, range: 2, index: 1 },
            { damage: 2, surge: 0, range: 3, index: 2 },
            { damage: 1, surge: 1, range: 3, index: 3 },
            { damage: 2, surge: 0, range: 4, index: 4 },
            { damage: 1, surge: 0, range: 5, index: 5 }
        ]);

    export const GREEN = new AttackDie(
        "green",
        [
            { damage: 0, surge: 1, range: 1, index: 0 },
            { damage: 1, surge: 1, range: 1, index: 1 },
            { damage: 2, surge: 0, range: 1, index: 2 },
            { damage: 1, surge: 1, range: 2, index: 3 },
            { damage: 2, surge: 0, range: 2, index: 4 },
            { damage: 2, surge: 0, range: 3, index: 5 }
        ]);

    export const YELLOW = new AttackDie(
        "yellow",
        [
            { damage: 0, surge: 1, range: 0, index: 0 },
            { damage: 1, surge: 2, range: 0, index: 1 },
            { damage: 2, surge: 0, range: 1, index: 2 },
            { damage: 1, surge: 1, range: 1, index: 3 },
            { damage: 0, surge: 1, range: 2, index: 4 },
            { damage: 1, surge: 0, range: 2, index: 5 }
        ]);
}