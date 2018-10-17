"use strict";

var app = app || {};
app.constants = app.constants || {};

(function (app) {

    let art_of_war = [{
            "name": "admirals_grip",
            "cost": 3,
            "is_mission": true
        },
        {
            "name": "piece_by_piece",
            "cost": 1,
            "is_mission": false
        },
        {
            "name": "three_steps_ahead",
            "cost": 2,
            "is_mission": false
        }
    ];

    let desert_scavengers = [{
            "name": "ion_blasters",
            "cost": 1,
            "is_mission": false
        },
        {
            "name": "jawa_raid",
            "cost": 1,
            "is_mission": false
        },
        {
            "name": "salvage_operatives",
            "cost": 3,
            "is_mission": true
        }
    ];

    let devious_droids = [{
            "name": "etiquette_and_torture",
            "cost": 3,
            "is_mission": true
        },
        {
            "name": "invasive_procedure",
            "cost": 2,
            "is_mission": false
        },
        {
            "name": "missile_salvo",
            "cost": 1,
            "is_mission": false
        }
    ];

    let ohnaka_gang = [{
            "name": "final_offer",
            "cost": 1,
            "is_mission": false
        },
        {
            "name": "missing_treasure",
            "cost": 1,
            "is_mission": false
        },
        {
            "name": "pirates_ploy",
            "cost": 3,
            "is_mission": true
        }
    ];

    let war_of_attrition = [{
            "name": "acceptable_margins",
            "cost": 2,
            "is_mission": false
        },
        {
            "name": "costly_victory",
            "cost": 1,
            "is_mission": false
        },
        {
            "name": "selfless_devotion",
            "cost": 1,
            "is_mission": false
        }
    ];

    let weapons_division = [{
            "name": "gas_canisters",
            "cost": 1,
            "is_mission": false
        },
        {
            "name": "ongoing_research",
            "cost": 1,
            "is_mission": false
        },
        {
            "name": "prototypes",
            "cost": 2,
            "is_mission": false
        }
    ];

    app.constants.decks = {
        art_of_war: art_of_war,
        desert_scavengers: desert_scavengers,
        devious_droids: devious_droids,
        ohnaka_gang: ohnaka_gang,
        war_of_attrition: war_of_attrition,
        weapons_division: weapons_division
    };

})(app);