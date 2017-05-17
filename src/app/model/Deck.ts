namespace swia.model {
    export class Deck {
        constructor(
            public readonly cards: CommandCard[]
        ) {
        }

        public get isLegal(): boolean {
            return this.cards.length === 15 && this.points <= 15;
        }

        public get points(): number {
            let total = 0;
            for (let card of this.cards) {
                total += card.cost;
            }
            return total;
        }
    }
}