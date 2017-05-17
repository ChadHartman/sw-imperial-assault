namespace swia.ng.build {

    const NO_FILTER = "no_filter";
    const NO_RESTRICTIONS = "no_restrictions";

    export class Filter {

        public affiliation: string;
        public restriction: string;
        public cost: any;

        constructor() {
            this.affiliation = NO_FILTER;
            this.restriction = NO_FILTER;
            this.cost = NO_FILTER;
        }

        public filter(card: model.CommandCard, deck: model.Deck): boolean {
            //console.log(`affiliation: ${this.affiliation}; restriction: ${this.restriction}`);
            return this.filterAffiliation(card) ||
                this.filterRestriction(card) ||
                this.filterLimit(card, deck);
        }

        private filterAffiliation(card: model.CommandCard): boolean {

            if (this.affiliation === NO_FILTER) {
                return false;
            }

            let filtered = this.affiliation !== card.affiliation;
            if (filtered) {
                //console.log(`Filtered due to affiliation; ${card.affiliation}: ${card.id}`);
            }
            return filtered;
        }

        private filterRestriction(card: model.CommandCard): boolean {

            if (this.restriction === NO_FILTER) {
                return false;
            }

            if (this.restriction === NO_RESTRICTIONS && !card.restrictions) {
                return false;
            }

            let filtered = !card.restrictions ||
                card.restrictions.indexOf(this.restriction) === -1;
            if (filtered) {
                //console.log(`Filtered due to restriction; ${JSON.stringify(card.restrictions)}: ${card.id}`);
            }
            return filtered;

        }

        private filterLimit(card: model.CommandCard, deck: model.Deck): boolean {
            let count = 0;
            for (let element of deck.cards) {
                if (card.id === element.id) {
                    count++;
                }
            }
            return count >= card.limit;
        }
    }
}