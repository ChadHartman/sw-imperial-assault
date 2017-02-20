"use strict"

var app = app || {};

app.imageLoader = {};

app.imageLoader.downloadImage = function(i, element) {
    var imgHolder = $(element);
    var imgId = imgHolder.text();
    var imgSrc = `/assets/images/campaign/${app.campaign}/${imgId}.png`;
    
    imgHolder.text('');
    var img = new Image();

    img.onload = function(){
        img = $(img);
        imgHolder
            .height('')
            .append(img);

        img.fadeIn();
    };

    setTimeout(function() {
        img.src = imgSrc;
    }, 3000);
};

app.imageLoader.loadImages = function() {
    app.campaign = $('meta[name="campaign"]').attr('content');
    $('.post > h6, .post > h5').each(app.imageLoader.downloadImage);
};

$(document).ready(app.imageLoader.loadImages);