namespace swia.model {

    export class Deck {

        public readonly cards: CommandCard[];
        public id: number;
        public name: string;
        public created: number;
        public updated: number;

        constructor() {
            this.cards = [];
            this.created = Date.now();
            this.updated = this.created;
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

        public get state(): Deck.State {

            let state = {
                id: this.id,
                name: this.name,
                card_ids: [],
                created: this.created,
                updated: this.updated
            };

            for (let card of this.cards) {
                (<string[]>state.card_ids).push(card.id);
            }

            return state;
        }

        public static from(state: Deck.State, cards: CommandCard[]): Deck {
            let deck = new Deck();
            deck.id = state.id;
            deck.name = state.name;
            deck.created = state.created;
            deck.updated = state.updated;

            for (let id of state.card_ids) {
                for (let card of cards) {
                    if (card.id === id) {
                        deck.cards.push(card);
                    }
                }
            }

            return deck;
        }
    }

    export module Deck {
        export interface State {
            id: number;
            name: string;
            card_ids: string[];
            created: number;
            updated: number;
        }
    }
}