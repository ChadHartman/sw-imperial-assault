declare namespace swia.model {
    interface CommandCard {
        id: string;
        title: string;
        affiliation?: string;
        restrictions?: string[];
        cost: number;
        limit: number;
        url: string;
    }
}
declare namespace swia.model {
    class Deck {
        readonly cards: CommandCard[];
        id: number;
        name: string;
        created: number;
        updated: number;
        exportUrl: string;
        constructor();
        readonly isLegal: boolean;
        readonly points: number;
        readonly state: Deck.State;
        static from(state: Deck.State, cards: CommandCard[]): Deck;
    }
    module Deck {
        interface State {
            id: number;
            name: string;
            card_ids: string[];
            created: number;
            updated: number;
        }
    }
}
declare let angular: any;
declare namespace swia.ng {
    let module: any;
}
declare namespace swia.ng {
    class CommandCardLoader {
        private readonly $http;
        private readonly $timeout;
        static readonly NAME: string;
        private cache;
        constructor($http: any, $timeout: any);
        cards(callback: (cards: model.CommandCard[]) => void): void;
    }
}
declare namespace swia.ng {
    class Store {
        private readonly $timeout;
        private readonly ccLoader;
        static readonly NAME: string;
        private state;
        private deckCache;
        constructor($timeout: any, ccLoader: CommandCardLoader);
        deleteDeck(id: number): void;
        import(state: model.Deck.State): void;
        save(deck: model.Deck): void;
        decks(callback: (decks: model.Deck[]) => void): void;
        deck(id: number, callback: (deck: model.Deck) => void): void;
    }
}
declare namespace swia.ng {
    class IndexController {
        private readonly $scope;
        private readonly store;
        static readonly NAME: string;
        static readonly PATH: string;
        static readonly HTML_NAME: string;
        constructor($scope: IndexController.Scope, store: Store);
        private onDecksLoad(decks);
        private deleteDeck(deck);
    }
    module IndexController {
        interface Scope {
            decks: model.Deck[];
            deleteDeck: (deck: model.Deck) => void;
        }
    }
}
declare namespace swia.ng {
    class BuildController {
        private readonly $scope;
        private readonly $location;
        private readonly store;
        static readonly NAME: string;
        static readonly PATH: string;
        static readonly HTML_NAME: string;
        constructor($scope: BuildController.Scope, $location: any, ccLoader: CommandCardLoader, store: Store);
        private saveDeck();
        private selectCard(card);
        private deselectCard(card);
        private onCardsLoad(cards);
    }
    module BuildController {
        interface Scope {
            deckName: string;
            error: string;
            filter: build.Filter;
            available: model.CommandCard[];
            deck: model.Deck;
            affiliations: string[];
            restrictions: string[];
            costs: number[];
            selectCard: (card: model.CommandCard) => void;
            deselectCard: (card: model.CommandCard) => void;
            saveDeck: () => void;
        }
    }
}
declare namespace swia.util {
    function popRandom(array: any[]): any;
}
declare namespace swia.ng {
    class PlayController {
        private readonly $scope;
        static readonly NAME: string;
        static readonly PATH: string;
        static readonly HTML_NAME: string;
        constructor($scope: PlayController.Scope, $routeParams: PlayController.RouteParams, store: Store);
        private onDeckLoad(deck);
        private discard(card);
        private draw();
        private restore(card);
    }
    module PlayController {
        interface Scope {
            name: string;
            drawDeck: model.CommandCard[];
            hand: model.CommandCard[];
            discardDeck: model.CommandCard[];
            draw: () => void;
            discard: (card: model.CommandCard) => void;
            restore: (card: model.CommandCard) => void;
        }
        interface RouteParams {
            deck_id: number;
        }
    }
}
declare namespace swia.ng {
    class ImportController {
        static readonly NAME: string;
        static readonly PATH: string;
        static readonly HTML_NAME: string;
        constructor($routeParams: ImportController.RouteParams, $location: any, store: Store);
    }
    module ImportController {
        interface RouteParams {
            deck: string;
        }
    }
}
declare namespace swia.ng {
}
declare namespace swia.ng.build {
    class Filter {
        affiliation: string;
        restriction: string;
        cost: any;
        constructor();
        filter(card: model.CommandCard, deck: model.Deck): boolean;
        private filterAffiliation(card);
        private filterRestriction(card);
        private filterCost(card);
        private filterLimit(card, deck);
    }
}
declare namespace swia.ng.filter {
}
