"use strict";

var app = angular.module('playerApp', []);

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

app.controller('PlayerController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

    let publish = function () {
        let path = 'games/' + app.util.normalizeText($scope.config.username);
        firebase.database().ref(path).set({
            played: $scope.player.played,
            discarded: $scope.player.discarded
        });
    }

    $scope.opponent = {};

    // TODO: remove constants
    $scope.config = {
        username: "Chad",
        opponent: "Seth",
        deck: "Celebration\nCovering Fire\nDeflection\nElement of Surprise\nFleet Footed\nMarksman\nPlanning\nRecovery\nTake Cover\nTake Initiative\nTelekinetic Throw\nUrgency\nForce Lightning\nLord of the Sith\nLure of the Dark Side",
        show: function () {
            return !$scope.config.play;
        },
        validate: function () {
            if (!$scope.config.username) {
                $scope.config.error = "Missing username";
                return false;
            }

            if (!$scope.config.opponent) {
                $scope.config.error = "Missing opponent's username";
                return false;
            }

            if (!$scope.config.deck) {
                $scope.config.error = "Missing deck";
                return false;
            }

            delete $scope.config.error;
            return true;
        },
        begin: function () {

            if (!this.validate()) {
                return;
            }

            $scope.config.deck.split("\n").forEach(function (element) {
                let id = app.util.normalizeText(element);
                $scope.player.deck.push({
                    name: element,
                    id: id
                });
            });

            $scope.config.play = true;

            let path = 'games/' + app.util.normalizeText($scope.config.opponent);

            firebase.database().ref(path).on('value', function (snapshot) {
                let opponent = snapshot.val();
                if (opponent) {
                    $timeout(function () {
                        $scope.opponent.played = opponent.played;
                        $scope.opponent.discarded = opponent.discarded;
                    });
                }
            });
        }
    }

    $scope.player = {
        deck: [],
        hand: [],
        played: [],
        discarded: [],
        show: function () {
            return $scope.config.play && !$scope.info.show();
        },
        moveRandom: function (origin, destination) {
            destination.push(app.util.popRandom(origin));
            publish();
        },
        move: function (index, origin, destination) {
            destination.push(origin.splice(index, 1)[0]);
            publish();
        },
        showInfo: function (card) {
            $scope.info.card = card;
        }
    };

    $scope.info = {
        back: function () {
            delete $scope.info.card;
        },
        show: function () {
            return $scope.info.card;
        }
    };
}]);