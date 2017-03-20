namespace App.Game {
    export class Deployment {

        public readonly id: string;
        public readonly title: string;
        public readonly image: HTMLImageElement;
        public readonly abilities: Array<App.Model.IAbility>;
        public readonly groupSize: number;
        public readonly speed: number;
        public readonly attackDice: Array<string>;
        public readonly health: number;
        public readonly rank: string;

        constructor(
            id: string,
            image: HTMLImageElement,
            data: App.Model.IDeployment,
            abilities: Array<App.Model.IAbility>) {

            this.id = id;
            this.title = data.title;
            this.rank = data.rank;
            this.image = image;
            this.health = data.health;
            this.abilities = abilities;
            this.groupSize = data.group_size;
            this.speed = data.speed;
            this.attackDice = data.attack || [];
        }
    }
}