namespace App.Game {

    export enum AttackType {
        NONE,
        RANGED,
        MELEE
    }

    export module AttackType {
        export function parse(name: String): AttackType {
            let value = AttackType[name.toUpperCase()];
            if (value === undefined) {
                throw new Error(`Invalid AttackType: ${name}`);
            }
            return value;
        }
    }

    export class Deployment {

        public readonly title: string;
        public readonly image: HTMLImageElement;
        public readonly abilities: Array<any>;
        public readonly groupSize: number;
        public readonly speed: number;
        public readonly attackType: AttackType;
        public readonly attackDice: Array<Dice.AttackDie>;
        public readonly defenseDice: Array<string>;
        public readonly health: number;
        public readonly rank: string;

        constructor(
            public readonly id: string,
            image: HTMLImageElement,
            data: App.Model.IDeployment,
            abilities: Array<any>) {

            this.id = id;
            this.title = data.title;
            this.rank = data.rank;
            this.image = image;
            this.health = data.health;
            this.abilities = abilities;
            this.groupSize = data.group_size;
            this.speed = data.speed;
            this.attackDice = new Array<Dice.AttackDie>();
            this.defenseDice = data.defense || [];

            if (data.attack) {
                this.attackType = AttackType.parse(data.attack.type);
                for (let die of data.attack.dice) {
                    this.attackDice.push(Dice.attackDie(die));
                }
            } else {
                this.attackType = AttackType.NONE;
            }
        }
    }
}