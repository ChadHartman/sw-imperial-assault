namespace App.Game.Dice {

    export interface IAttackSide {
        damage: number;
        surge: number;
        range: number;
    }

    export class AttackDie {

        public readonly name: string;
        private readonly sides: Array<IAttackSide>;

        constructor(name: string, sides: Array<IAttackSide>) {
            this.name = name;
            this.sides = sides;
        }

        public roll(): IAttackSide {
            let index = Math.floor(Math.random() * this.sides.length);
            return this.sides[index];
        }   
    }

    export const RED = new AttackDie(
        "red",
        [
            { damage: 1, surge: 0, range: 0 },
            { damage: 2, surge: 0, range: 0 },
            { damage: 2, surge: 0, range: 0 },
            { damage: 2, surge: 1, range: 0 },
            { damage: 3, surge: 0, range: 0 },
            { damage: 3, surge: 0, range: 0 }
        ]);

    export const BLUE = new AttackDie(
        "blue",
        [
            { damage: 0, surge: 1, range: 2 },
            { damage: 1, surge: 0, range: 2 },
            { damage: 2, surge: 0, range: 3 },
            { damage: 1, surge: 1, range: 3 },
            { damage: 2, surge: 0, range: 4 },
            { damage: 1, surge: 0, range: 5 }
        ]);

    export const GREEN = new AttackDie(
        "green",
        [
            { damage: 0, surge: 1, range: 1 },
            { damage: 1, surge: 1, range: 1 },
            { damage: 2, surge: 0, range: 1 },
            { damage: 1, surge: 1, range: 2 },
            { damage: 2, surge: 0, range: 2 },
            { damage: 2, surge: 0, range: 3 }
        ]);

    export const YELLOW = new AttackDie(
        "yellow",
        [
            { damage: 0, surge: 1, range: 0 },
            { damage: 1, surge: 2, range: 0 },
            { damage: 2, surge: 0, range: 1 },
            { damage: 1, surge: 1, range: 1 },
            { damage: 0, surge: 1, range: 2 },
            { damage: 1, surge: 0, range: 2 }
        ]);
}