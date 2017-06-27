"use strict";

var app = angular.module('playerApp', []);

app.controller('PlayerController', ['$scope', function ($scope) {

    if (!localStorage.deck) {
        window.location = "../builder/index.html?message=You+need+to+create+a+deck";
        return;
    }

    $scope.deck = localStorage.deck;
    

}]);


// // Sending message
// $('#sendBtn').click(function () {
//     $.post(linkUrl, $('#msgInput').val());
//     $('#msgInput').val(null);
// })

// // Receiving message
// var receive = function () {
//     $.get(linkUrl).done(function (data) {
//         $('#receivedData').append(data + '<br>');
//         receive();
//     })
// }

// var linkUrl;
// $('#channelInput').on('change keyup', function () {
//     linkUrl = 'https://httprelay.io/link/' + $('#channelInput').val();
//     $('.linkContainer').html(linkUrl)
// })

// // Generating random channel id
// $('#channelInput').val(Math.random().toString(36).substr(4)).trigger('change')

// receive();