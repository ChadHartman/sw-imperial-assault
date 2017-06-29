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

app.controller('PlayerController', ['$scope', '$http', function ($scope, $http) {

    // let publish = function (username, played, discarded) {
    //     $http({
    //         method: "POST",
    //         url: `http://httprelay.io/link/${encodeURIComponent($scope.config.username)}`,
    //         data: {
    //             played: $scope.player.played,
    //             discarded: $scope.player.discarded
    //         }
    //     }).then(null, function (reason) {
    //         console.error(reason);
    //         $scope.player.error = reason;
    //     });
    // };

    // TODO: remove constants
    $scope.config = {
        username: "Chad",
        opponent: "Seth",
        deck: "Celebration\nCovering Fire\nDeflection\nElement of Surprise\nFleet Footed\nMarksman\nPlanning\nRecovery\nTake Cover\nTake Initiative\nTelekinetic Throw\nUrgency\nForce Lightning\nLord of the Sith\nLure of the Dark Side",
        show: function () {
            return !$scope.config.play;
        },
        begin: function () {

            if (!$scope.config.username) {
                $scope.config.error = "Missing username";
                return;
            }

            if (!$scope.config.opponent) {
                $scope.config.error = "Missing opponent's username";
                return;
            }

            if (!$scope.config.deck) {
                $scope.config.error = "Missing deck";
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
        },
        move: function (index, origin, destination) {
            destination.push(origin.splice(index, 1)[0]);
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