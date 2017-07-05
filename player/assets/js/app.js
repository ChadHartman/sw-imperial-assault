"use strict";

(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAfLRJnIB3MPajxi0qQBN-Y5vDY-o4LkjM",
        authDomain: "swia-card-player.firebaseapp.com",
        databaseURL: "https://swia-card-player.firebaseio.com",
        projectId: "swia-card-player",
        storageBucket: "",
        messagingSenderId: "494843917868"
    };
    firebase.initializeApp(config);
})();

var app = angular.module('playerApp', ["ngRoute"]);

app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
}]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: `assets/html/config.html`
            , controller: "ConfigController"
        })
        .when("/player", {
            templateUrl: `assets/html/player.html`
            , controller: "PlayerController"
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.factory('authResolver', [
    '$routeParams',
    '$timeout',
    function ($routeParams, $timeout) {

        let auth = {
            signedIn: false,
            signingIn: false,
            signIn: function () {
                this.signingIn = true;
                if (!$routeParams.e || !$routeParams.p) {
                    this.error = "Missing credentials.";
                    return;
                }
                self = this;

                let success = function () {
                    $timeout(function () {
                        self.signedIn = true;
                        self.signingIn = false;
                    });
                };

                let failure = function (error) {
                    $timeout(function () {
                        self.error = error.message;
                        self.signingIn = false;
                    });
                };

                firebase.auth().signInWithEmailAndPassword(
                    $routeParams.e,
                    $routeParams.p
                ).then(success).catch(failure);
            }
        };

        return function () {
            return auth;
        };
    }]
);

app.util = {
    normalizeText: function (text) {

        text = text
            .toLowerCase()
            .replace(/[^a-z0-9]|\s+|\r?\n|\r/gmi, ' ')
            .trim()
            .replace(/ /g, '_');

        let lastLen;
        do {
            lastLen = text.length;
            text = text.replace('__', '_');
        } while (lastLen !== text.length);

        return text;
    },
    popRandom: function (array) {
        let index = Math.floor(Math.random() * array.length);
        return array.splice(index, 1)[0];
    }
};

app.controller('ConfigController', [
    '$scope',
    '$routeParams',
    'authResolver',

    function ($scope, $routeParams, authResolver) {

        let auth = authResolver();

        if (!auth.signedIn && !auth.signingIn) {
            auth.signIn();
        }

        $scope.invalid = function () {

            if (auth.error) {
                $scope.error = auth.error;
                return true;
            }

            if (!$scope.player) {
                $scope.error = "Missing username";
                return true;
            }

            if (!$scope.opponent) {
                $scope.error = "Missing opponent's username";
                return true;
            }

            if (!$scope.deck) {
                $scope.error = "Missing deck";
                return true;
            }

            delete $scope.error;

            return false;
        };

        $scope.update = function () {

            if ($scope.invalid()) {
                return;
            }

            let e = encodeURIComponent($routeParams.e || '');
            let p = encodeURIComponent($routeParams.p || '');
            let player = app.util.normalizeText($scope.player || '');
            let opponent = app.util.normalizeText($scope.opponent || '');
            let deck = encodeURIComponent($scope.deck || '');

            $scope.params = `e=${e}&p=${p}&player=${player}&opponent=${opponent}&deck=${deck}`;
        };
    }
]);

app.controller('PlayerController', [
    '$scope',
    '$routeParams',
    '$timeout',
    'authResolver',
    function ($scope, $routeParams, $timeout, authResolver) {

        let auth = authResolver();

        if (!auth.signedIn && !auth.signingIn) {
            auth.signIn();
        }

        $scope.opponent = {
            name: $routeParams.opponent,
            isSignedOut: function () {
                return (Date.now() - (this.updated || 0)) > 900000;
            }
        };

        $scope.player = {
            name: $routeParams.player,
            deck: [],
            hand: [],
            played: [],
            discarded: []
        };

        $routeParams.deck.trim().split("\n").forEach(function (element) {
            let id = app.util.normalizeText(element);
            $scope.player.deck.push({
                name: element,
                id: id
            });
        });

        let path = 'games/' + app.util.normalizeText($scope.opponent.name);
        firebase.database().ref(path).on('value', function (snapshot) {
            let opponentInfo = snapshot.val();
            $timeout(function () {
                if (opponentInfo) {
                    $scope.opponent.played = opponentInfo.played;
                    $scope.opponent.discarded = opponentInfo.discarded;
                    $scope.opponent.updated = opponentInfo.updated || 0;
                } else {
                    $scope.opponent.played = [];
                    $scope.opponent.discarded = [];
                    $scope.opponent.updated = 0;
                }
            });
        });

        let publish = function () {
            let path = 'games/' + app.util.normalizeText($scope.player.name);
            firebase.database().ref(path).set({
                played: $scope.player.played,
                discarded: $scope.player.discarded,
                updated: Date.now()
            });
        }

        publish();

        $scope.moveRandom = function ($event, origin, destination) {
            $event.stopPropagation();
            destination.push(app.util.popRandom(origin));
            publish();
        };

        $scope.move = function ($event, index, origin, destination) {
            $event.stopPropagation();
            destination.push(origin.splice(index, 1)[0]);
            publish();
        }

        $scope.info = function (card) {
            $scope.cardDetailId = card.id;
        }

        $scope.back = function () {
            delete $scope.cardDetailId;
        }
    }]
);