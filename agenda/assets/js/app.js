"use strict";

var app = app || {};
app.LOCAL_STORAGE_KEY = "app_state"
app.state = {
    selected_decks: [],
    draw_count: 4,
    omit_missions: false,
    filtered_cards: []
};

app.saveState = function () {
    localStorage[app.LOCAL_STORAGE_KEY] = JSON.stringify(app.state);
};

app.filterItem = function (ev) {
    app.state.filtered_cards.push(ev.target.id);
    app.drawCards();
}

app.drawCards = function () {

    let pool = [];

    for (let deckId of app.state.selected_decks) {
        for (let card of app.constants.decks[deckId]) {

            if (card.is_mission && app.state.omit_missions) {
                continue;
            }

            card.id = `${deckId}-${card.name}`;
            card.deck_id = deckId;

            if (app.state.filtered_cards.indexOf(card.id) !== -1) {
                continue;
            }

            pool.push(card);
        }
    }

    let selected = [];

    for (let i = 0; i < app.state.draw_count; i++) {
        selected.push(...pool.splice(Math.floor(Math.random() * pool.length), 1));
    }

    selected.sort((a, b) => {

        if (a.cost === b.cost) {
            if (a.deck_id == b.deck_id) {
                return a.name.localeCompare(b.name);
            } else {
                return a.deck_id.localeCompare(b.deck_id);
            }
        }

        return a.cost > b.cost;
    });

    $(`#draw`).empty();

    for (let card of selected) {
        let img = $('<img/>')
            .attr('src', `assets/img/${card.deck_id}/${card.name}.jpg`)
            .attr('id', card.id)
            .click(app.filterItem);

        $(`#draw`).append(img);
    }
};

app.toggleFilter = function (event) {

    app.state.selected_decks = [];

    $('#decks input[type="checkbox"]').each((index, element) => {
        if (element.checked) {
            let deckId = $(element).attr('data-deck');
            app.state.selected_decks.push(deckId);
        }
    });

    app.drawCards();
    app.saveState();
};

app.setup = function () {

    if (app.LOCAL_STORAGE_KEY in localStorage) {
        app.state = JSON.parse(localStorage[app.LOCAL_STORAGE_KEY]);
        app.state.filtered_cards = [];
    }

    // Setup draw count
    $('#draw-count')
        .val(app.state.draw_count)
        .on('input', function (ev) {
            app.state.draw_count = $(this).val();
            app.saveState();
            app.drawCards();
        });

    // Setup omit missions
    $('#omit-missions')
        .prop('checked', app.state.omit_missions)
        .on('input', function (ev) {
            app.state.omit_missions = this.checked;
            app.saveState();
            app.drawCards();
        });

    // Populate available decks
    for (let deckId in app.constants.decks) {

        let filterId = `filter-${deckId}`;

        let input = $('<input/>')
            .attr('id', filterId)
            .attr('data-deck', deckId)
            .attr('type', 'checkbox')
            .prop('checked', app.state.selected_decks.indexOf(deckId) !== -1)
            .click(app.toggleFilter);

        let label = $('<label/>')
            .attr('for', filterId)
            .text(deckId);

        $("#decks")
            .append(input)
            .append(label)
            .append($('<br/>'));
    }

    app.drawCards();
};

$(document).ready(app.setup);