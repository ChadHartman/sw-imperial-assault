namespace App.Game {

    export class Modifier {

        public readonly type: Attribute;
        public readonly value: number | null;
        public readonly status: StatusEffect | null;
        private readonly description: string;

        constructor(data: Model.IModifier) {
            this.type = Attribute.parse(data.type);
            this.status = data.status === undefined ? null : StatusEffect.parse(data.status);
            this.value = data.value || null;
            this.description = this.createDescription();
        }

        private createDescription(): string {

            let description = "";

            if (this.status !== null) {
                description += `${StatusEffect[this.status]}`;
            }

            if (this.value !== null) {
                description += `${this.value < 0 ? "" : "+"}${this.value} `;
            }

            description += `:${Attribute[this.type]}:`;

            return description
        }

        public toString(): string {
            return this.description;
        }
    }
}
