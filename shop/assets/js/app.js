"use strict";

var app = app || {};

app.state = app.state || {};
app.state.filteredTiers = [];
app.state.filteredItems = [];

app.createItemId = function (tierId, name) {
    return `tier${tierId}-${name}`;
}

app.filterItem = function (event) {
    let elem = $(event.target);
    let tierId = elem.attr('data-tier');
    let name = elem.attr('data-name');
    let itemId = app.createItemId(tierId, name);

    app.state.filteredItems.push(itemId);
    app.drawShop();
};

app.setupTier = function (tierId) {

    let available = [];
    let items = app.constants.tiers[tierId];
    for (let item of items) {
        let itemId = app.createItemId(tierId, item.name);
        if (app.state.filteredItems.indexOf(itemId) !== -1) {
            continue;
        }
        available.push(item);
    }

    let count = Math.ceil(items.length / 2);
    let selected = [];

    for (let i = 0; i < count; i++) {
        selected.push(...available.splice(Math.floor(Math.random() * available.length), 1));
    }

    selected.sort((a, b) => {
        return a.category.localeCompare(b.category);
    });

    for (let item of selected) {
        let img = $('<img/>')
            .attr('src', `assets/img/tier_${tierId}/${item.name}.jpg`)
            .attr('data-tier', tierId)
            .attr('data-name', item.name)
            .click(app.filterItem);

        $(`#tier${tierId}-shop`).append(img);
    }
};

app.drawShop = function () {

    $('div.shop').empty();

    for (let tierId of app.state.filteredTiers) {
        this.setupTier(tierId);
    }
};

app.toggleFilter = function (event) {
    app.state.filteredTiers = [];

    $('input[type="checkbox"]').each((index, element) => {
        if (element.checked) {
            app.state.filteredTiers.push($(element).attr('data-tier'));
        }
    });

    app.drawShop();
};

app.setup = function () {
    $('input[type="checkbox"]').click(app.toggleFilter);
    app.drawShop();
};

$(document).ready(app.setup);