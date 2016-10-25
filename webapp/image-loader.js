"use strict"

var app = app || {};

app.imageLoader = {};

app.imageLoader.setDimensions = function(container, ratio) {

    if(!ratio) {
        return;
    }

    container.height(container.width() / ratio);
};

app.imageLoader.downloadImage = function(i, element) {
    var imgHolder = $(element);
    var imgId = imgHolder.text();
    var imgSrc = app.baseUrl + app.resources.images[imgId].src;
    
    app.imageLoader.setDimensions(imgHolder, app.resources.images[imgId].w_x_h_ratio);
    imgHolder.text('');
    var imgElement = $('<img/>');

    var imgDownloader = new Image();

    imgDownloader.onload = function(){
        imgElement.attr('src', this.src);
        imgHolder
            .append(imgElement)
            .height('');
    };

    imgDownloader.src = imgSrc;
};

app.imageLoader.loadImages = function() {
    $('.post > h6, .post > h5').each(app.imageLoader.downloadImage);
};

$(document).ready(app.imageLoader.loadImages);