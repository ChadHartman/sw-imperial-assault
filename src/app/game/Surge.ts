namespace App.Game {
    export class Surge {

        public readonly cost: number;
        public readonly modifiers: Array<IModifier>;
        private readonly description: string;

        constructor(data: Model.ISurge) {

            this.cost = data.cost;
            this.modifiers = new Array<IModifier>();

            let description = "";

            for (let iMod of data.modifiers) {
                let modifier = IModifier.parse(iMod)
                this.modifiers.push(modifier);

                if (this.modifiers.length > 0) {
                    description += ", ";
                }

                description += `${Attribute[modifier.type]} `;

                if (modifier.status !== undefined) {
                    description += `${StatusEffect[modifier.status]}`;
                }

                if (modifier.value !== undefined) {
                    description += `${modifier.value}`;
                }
            }

            this.description = this.cost + ": " + description;
        }

        public toString(): string {
            return this.description;
        }
    }
}