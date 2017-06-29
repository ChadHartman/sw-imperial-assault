"use strict";

var app = angular.module('playerApp', []);

app.controller('PlayerController', ['$scope', function ($scope) {

    $scope.config = {};

    $scope.playClick = function () {

        if (!$scope.config.username) {
            $scope.config.error = "Missing username";
            console.log(config);
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

        $scope.config.play = true;
    };

}]);