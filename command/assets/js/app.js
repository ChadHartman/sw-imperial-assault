"use strict";
"use strict";
var swia;
(function (swia) {
    var model;
    (function (model) {
        class Deck {
            constructor() {
                this.cards = [];
                this.created = Date.now();
                this.updated = this.created;
            }
            get isLegal() {
                return this.cards.length === 15 && this.points <= 15;
            }
            get points() {
                let total = 0;
                for (let card of this.cards) {
                    total += card.cost;
                }
                return total;
            }
            get state() {
                let state = {
                    id: this.id,
                    name: this.name,
                    card_ids: [],
                    created: this.created,
                    updated: this.updated
                };
                for (let card of this.cards) {
                    state.card_ids.push(card.id);
                }
                return state;
            }
            static from(state, cards) {
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
        model.Deck = Deck;
    })(model = swia.model || (swia.model = {}));
})(swia || (swia = {}));
"use strict";
var swia;
(function (swia) {
    var ng;
    (function (ng) {
        ng.module = angular.module("swia", ["ngRoute"]);
    })(ng = swia.ng || (swia.ng = {}));
})(swia || (swia = {}));
/// <reference path="../modules/swia.ts"/>
"use strict";
var swia;
(function (swia) {
    var ng;
    (function (ng) {
        class CommandCardLoader {
            constructor($http, $timeout) {
                this.$http = $http;
                this.$timeout = $timeout;
            }
            cards(callback) {
                if (this.cache) {
                    let cache = this.cache;
                    this.$timeout(function () {
                        callback(cache);
                    });
                    return;
                }
                let self = this;
                this.$http({
                    method: 'GET',
                    url: 'assets/json/command/cards.json',
                    cache: true
                }).then(function successCallback(response) {
                    self.cache = response.data.cards;
                    callback(self.cache);
                }, function errorCallback(response) {
                    console.error(response);
                });
            }
        }
        CommandCardLoader.NAME = "command_card_loader";
        ng.CommandCardLoader = CommandCardLoader;
        ng.module.factory(CommandCardLoader.NAME, [
            "$http",
            "$timeout",
            function ($http, $timeout) {
                return new CommandCardLoader($http, $timeout);
            }
        ]);
    })(ng = swia.ng || (swia.ng = {}));
})(swia || (swia = {}));
/// <reference path="../modules/swia.ts"/>
/// <reference path="CommandCardLoader.ts"/>
"use strict";
var swia;
(function (swia) {
    var ng;
    (function (ng) {
        const LS_KEY = "command_decks";
        class Store {
            constructor($timeout, ccLoader) {
                this.$timeout = $timeout;
                this.ccLoader = ccLoader;
                if (LS_KEY in localStorage) {
                    this.state = JSON.parse(localStorage[LS_KEY]);
                }
                else {
                    this.state = {
                        __last_id__: 0,
                        decks: []
                    };
                }
            }
            deleteDeck(id) {
                for (let i = 0; i < this.state.decks.length; i++) {
                    let deck = this.state.decks[i];
                    if (deck.id === id) {
                        this.state.decks.splice(i, 1);
                        localStorage[LS_KEY] = JSON.stringify(this.state);
                        delete this.deckCache;
                        return;
                    }
                }
                throw new Error(`Unable to find deck ${id}`);
            }
            import(state) {
                this.state.decks.push(state);
                localStorage[LS_KEY] = JSON.stringify(this.state);
                delete this.deckCache;
            }
            save(deck) {
                if (!deck.id) {
                    deck.id = ++this.state.__last_id__;
                }
                this.state.decks.push(deck.state);
                localStorage[LS_KEY] = JSON.stringify(this.state);
                if (this.deckCache) {
                    this.deckCache.push(deck);
                }
            }
            decks(callback) {
                if (this.deckCache) {
                    let decks = this.deckCache;
                    this.$timeout(function () {
                        callback(decks);
                    });
                    return;
                }
                let self = this;
                this.ccLoader.cards(function (cards) {
                    self.deckCache = [];
                    for (let deckState of self.state.decks) {
                        self.deckCache.push(swia.model.Deck.from(deckState, cards));
                    }
                    callback(self.deckCache);
                });
            }
            deck(id, callback) {
                if (this.deckCache) {
                    for (let deck of this.deckCache) {
                        if (deck.id == id) {
                            this.$timeout(function () {
                                callback(deck);
                            });
                            return;
                        }
                    }
                    throw new Error(`No deck with id: ${id}`);
                }
                let self = this;
                this.decks(function (decks) {
                    self.deck(id, callback);
                });
            }
        }
        Store.NAME = "store";
        ng.Store = Store;
        ng.module.factory(Store.NAME, [
            '$timeout',
            ng.CommandCardLoader.NAME,
            function ($timeout, commandCardLoader) {
                return new Store($timeout, commandCardLoader);
            }
        ]);
    })(ng = swia.ng || (swia.ng = {}));
})(swia || (swia = {}));
/// <reference path="../modules/swia.ts"/>
/// <reference path="../services/Store.ts"/>
"use strict";
var swia;
(function (swia) {
    var ng;
    (function (ng) {
        class IndexController {
            constructor($scope, store) {
                this.$scope = $scope;
                this.store = store;
                this.$scope.deleteDeck = this.deleteDeck.bind(this);
                store.decks(this.onDecksLoad.bind(this));
            }
            onDecksLoad(decks) {
                this.$scope.decks = decks;
                for (let deck of decks) {
                    deck.exportUrl = "#/import?deck=" + encodeURIComponent(JSON.stringify(deck.state));
                }
            }
            deleteDeck(deck) {
                if (window.confirm("Are you sure?")) {
                    this.store.deleteDeck(deck.id);
                    this.store.decks(this.onDecksLoad.bind(this));
                }
            }
        }
        IndexController.NAME = "indexController";
        IndexController.PATH = "/";
        IndexController.HTML_NAME = "index";
        ng.IndexController = IndexController;
        ng.module.controller(IndexController.NAME, [
            '$scope',
            ng.Store.NAME,
            IndexController
        ]);
    })(ng = swia.ng || (swia.ng = {}));
})(swia || (swia = {}));
/// <reference path="../modules/swia.ts"/>
/// <reference path="../services/CommandCardLoader.ts"/>
/// <reference path="../services/Store.ts"/>
"use strict";
var swia;
(function (swia) {
    var ng;
    (function (ng) {
        class BuildController {
            constructor($scope, $location, ccLoader, store) {
                this.$scope = $scope;
                this.$location = $location;
                this.store = store;
                $scope.deck = new swia.model.Deck();
                $scope.selectCard = this.selectCard.bind(this);
                $scope.deselectCard = this.deselectCard.bind(this);
                $scope.saveDeck = this.saveDeck.bind(this);
                $scope.filter = new ng.build.Filter();
                ccLoader.cards(this.onCardsLoad.bind(this));
            }
            saveDeck() {
                if (!this.$scope.deckName) {
                    this.$scope.error = "Deck name must be provided";
                    return;
                }
                if (this.$scope.deck.cards.length !== 15) {
                    this.$scope.error = "There must be 15 cards";
                    return;
                }
                if (this.$scope.deck.points > 15) {
                    this.$scope.error = "Points must be 15 and under";
                    return;
                }
                this.$scope.deck.name = this.$scope.deckName;
                this.store.save(this.$scope.deck);
                this.$location.path(ng.IndexController.PATH);
            }
            selectCard(card) {
                this.$scope.deck.cards.push(card);
            }
            deselectCard(card) {
                let index = this.$scope.deck.cards.indexOf(card);
                this.$scope.deck.cards.splice(index, 1);
            }
            onCardsLoad(cards) {
                this.$scope.available = cards;
                let affiliations = new Set();
                let restrictions = new Set();
                let costs = new Set();
                for (let card of cards) {
                    card.url = `assets/img/command/${card.id}.jpg`;
                    if (card.affiliation) {
                        affiliations.add(card.affiliation);
                    }
                    if (card.restrictions) {
                        for (let restriction of card.restrictions) {
                            restrictions.add(restriction);
                        }
                    }
                    costs.add(card.cost);
                }
                this.$scope.affiliations = Array.from(affiliations).sort();
                this.$scope.restrictions = Array.from(restrictions).sort();
                this.$scope.costs = Array.from(costs).sort();
            }
        }
        BuildController.NAME = "buildController";
        BuildController.PATH = "/build";
        BuildController.HTML_NAME = "build";
        ng.BuildController = BuildController;
        ng.module.controller(BuildController.NAME, [
            '$scope',
            '$location',
            ng.CommandCardLoader.NAME,
            ng.Store.NAME,
            BuildController
        ]);
    })(ng = swia.ng || (swia.ng = {}));
})(swia || (swia = {}));
"use strict";
var swia;
(function (swia) {
    var util;
    (function (util) {
        function popRandom(array) {
            let index = Math.floor(Math.random() * array.length);
            return array.splice(index, 1)[0];
        }
        util.popRandom = popRandom;
    })(util = swia.util || (swia.util = {}));
})(swia || (swia = {}));
/// <reference path="../modules/swia.ts"/>
/// <reference path="../../util.ts"/>
"use strict";
var swia;
(function (swia) {
    var ng;
    (function (ng) {
        class PlayController {
            constructor($scope, $routeParams, store) {
                this.$scope = $scope;
                this.$scope.hand = [];
                this.$scope.discardDeck = [];
                this.$scope.draw = this.draw.bind(this);
                this.$scope.discard = this.discard.bind(this);
                this.$scope.restore = this.restore.bind(this);
                store.deck($routeParams.deck_id, this.onDeckLoad.bind(this));
            }
            onDeckLoad(deck) {
                this.$scope.name = deck.name;
                this.$scope.drawDeck = angular.copy(deck.cards);
                for (let i = 0; i < 3; i++) {
                    this.$scope.hand.push(swia.util.popRandom(this.$scope.drawDeck));
                }
            }
            discard(card) {
                let index = this.$scope.hand.indexOf(card);
                let discarded = this.$scope.hand.splice(index, 1)[0];
                this.$scope.discardDeck.push(discarded);
            }
            draw() {
                this.$scope.hand.push(swia.util.popRandom(this.$scope.drawDeck));
            }
            restore(card) {
                let index = this.$scope.discardDeck.indexOf(card);
                let discarded = this.$scope.discardDeck.splice(index, 1)[0];
                this.$scope.hand.push(discarded);
            }
        }
        PlayController.NAME = "playController";
        PlayController.PATH = "/play/:deck_id";
        PlayController.HTML_NAME = "play";
        ng.PlayController = PlayController;
        ng.module.controller(PlayController.NAME, [
            '$scope',
            '$routeParams',
            ng.Store.NAME,
            PlayController
        ]);
    })(ng = swia.ng || (swia.ng = {}));
})(swia || (swia = {}));
/// <reference path="../modules/swia.ts"/>
"use strict";
var swia;
(function (swia) {
    var ng;
    (function (ng) {
        class ImportController {
            constructor($routeParams, $location, store) {
                let deckState = JSON.parse($routeParams.deck);
                store.import(deckState);
                // Clear out query string
                $location.path(ng.IndexController.PATH + "?");
            }
        }
        ImportController.NAME = "importController";
        ImportController.PATH = "/import";
        ImportController.HTML_NAME = "import";
        ng.ImportController = ImportController;
        ng.module.controller(ImportController.NAME, [
            '$routeParams',
            '$location',
            ng.Store.NAME,
            ImportController
        ]);
    })(ng = swia.ng || (swia.ng = {}));
})(swia || (swia = {}));
/// <reference path="../modules/swia.ts"/>
/// <reference path="../controllers/IndexController.ts"/>
/// <reference path="../controllers/BuildController.ts"/>
/// <reference path="../controllers/PlayController.ts"/>
/// <reference path="../controllers/ImportController.ts"/>
"use strict";
var swia;
(function (swia) {
    var ng;
    (function (ng) {
        function addRoute($routeProvider, controller) {
            $routeProvider.when(controller.PATH, {
                templateUrl: `assets/html/routes/${controller.HTML_NAME}.html`,
                controller: controller.NAME
            });
        }
        ng.module
            .config(['$locationProvider', function ($locationProvider) {
                $locationProvider.hashPrefix('');
            }])
            .config(['$routeProvider', function ($routeProvider) {
                addRoute($routeProvider, ng.IndexController);
                addRoute($routeProvider, ng.BuildController);
                addRoute($routeProvider, ng.PlayController);
                addRoute($routeProvider, ng.ImportController);
                $routeProvider.otherwise({
                    redirectTo: '/'
                });
            }]);
    })(ng = swia.ng || (swia.ng = {}));
})(swia || (swia = {}));
"use strict";
var swia;
(function (swia) {
    var ng;
    (function (ng) {
        var build;
        (function (build) {
            const NO_FILTER = "no_filter";
            const NO_RESTRICTIONS = "no_restrictions";
            class Filter {
                constructor() {
                    this.affiliation = NO_FILTER;
                    this.restriction = NO_FILTER;
                    this.cost = NO_FILTER;
                }
                filter(card, deck) {
                    //console.log(`affiliation: ${this.affiliation}; restriction: ${this.restriction}`);
                    return this.filterAffiliation(card) ||
                        this.filterRestriction(card) ||
                        this.filterCost(card) ||
                        this.filterLimit(card, deck);
                }
                filterAffiliation(card) {
                    if (this.affiliation === NO_FILTER) {
                        return false;
                    }
                    let filtered = this.affiliation !== card.affiliation;
                    if (filtered) {
                    }
                    return filtered;
                }
                filterRestriction(card) {
                    if (this.restriction === NO_FILTER) {
                        return false;
                    }
                    if (this.restriction === NO_RESTRICTIONS && !card.restrictions) {
                        return false;
                    }
                    let filtered = !card.restrictions ||
                        card.restrictions.indexOf(this.restriction) === -1;
                    if (filtered) {
                    }
                    return filtered;
                }
                filterCost(card) {
                    if (this.cost === NO_FILTER) {
                        return false;
                    }
                    return this.cost != card.cost;
                }
                filterLimit(card, deck) {
                    let count = 0;
                    for (let element of deck.cards) {
                        if (card.id === element.id) {
                            count++;
                        }
                    }
                    return count >= card.limit;
                }
            }
            build.Filter = Filter;
        })(build = ng.build || (ng.build = {}));
    })(ng = swia.ng || (swia.ng = {}));
})(swia || (swia = {}));
"use strict";
var swia;
(function (swia) {
    var ng;
    (function (ng) {
        var filter;
        (function (filter) {
            ng.module.filter('spacer', function () {
                return function (value) {
                    return (!value) ? '' : value.split('_').join(' ');
                };
            });
        })(filter = ng.filter || (ng.filter = {}));
    })(ng = swia.ng || (swia.ng = {}));
})(swia || (swia = {}));
//# sourceMappingURL=app.js.map