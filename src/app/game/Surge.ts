namespace App.Game {

    export class Surge {

        public readonly cost: number;
        public readonly modifiers: Array<Modifier>;
        private readonly description: string;

        constructor(data: Model.ISurge) {

            this.cost = data.cost;
            this.modifiers = new Array<Modifier>();
            for (let modifier of data.modifiers) {
                this.modifiers.push(new Modifier(modifier));
            }
            this.description = this.createDescription();
        }

        private createDescription(): string {

            let description = "";

            for (let i = 0; i < this.cost; i++) {
                description += ":surge:";
            }

            description += ": " + this.modifiers.join(", ");

            return description;
        }

        public toString(): string {
            return this.description;
        }
    }
}