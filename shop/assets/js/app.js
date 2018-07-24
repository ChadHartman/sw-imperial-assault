"use strict";

var app = app || {};

app.getQueryParams = function () {
    let queryParams = {};
    if (window.location.search.length > 0) {
        let params = window.location.search.substr(1).split('&');
        for (let param of params) {
            let comps = param.split('=');
            queryParams[comps[0]] = comps[1];
        }
    }
    return queryParams;
};

$(document).ready(function () {

    // Tier 1
    let tier1 = [{
            "name": "armored_gauntlets",
            "category": "weapon_melee"
        },
        {
            "name": "bacta_pump",
            "category": "item"
        },
        {
            "name": "balanced_hilt",
            "category": "upgrade_melee"
        },
        {
            "name": "charge_pistol",
            "category": "weapon_ranged"
        },
        {
            "name": "charged_ammo_pack",
            "category": "upgrade_ranged"
        },
        {
            "name": "combat_coat",
            "category": "armor"
        },
        {
            "name": "ddc_defender",
            "category": "weapon_ranged"
        },
        {
            "name": "dh_17",
            "category": "weapon_ranged"
        },
        {
            "name": "dl_44",
            "category": "weapon_ranged"
        },
        {
            "name": "e_11",
            "category": "weapon_ranged"
        },
        {
            "name": "emergency_injector",
            "category": "item"
        },
        {
            "name": "extended_haft",
            "category": "upgrade_melee"
        },
        {
            "name": "gaffi_stick",
            "category": "weapon_melee"
        },
        {
            "name": "hand_cannon",
            "category": "weapon_ranged"
        },
        {
            "name": "marksman_barrel",
            "category": "upgrade_ranged"
        },
        {
            "name": "portable_medkit",
            "category": "item"
        },
        {
            "name": "responsive_armor",
            "category": "armor"
        },
        {
            "name": "shadowsilk_cloak",
            "category": "armor"
        },
        {
            "name": "survival_gear",
            "category": "item"
        },
        {
            "name": "tactical_display",
            "category": "upgrade_ranged"
        },
        {
            "name": "tatooine_hunting_rifle",
            "category": "weapon_ranged"
        },
        {
            "name": "under_barrel_hh_4",
            "category": "upgrade_ranged"
        },
        {
            "name": "vibroblade",
            "category": "weapon_melee"
        },
        {
            "name": "vibroknife",
            "category": "weapon_melee"
        },
        {
            "name": "vibrosword",
            "category": "weapon_melee"
        }
    ];

    let queryParams = app.getQueryParams();
    let items = [];
    let exclusions = queryParams["exclude"] || "";
    exclusions = exclusions.length > 0 ? exclusions.split(',') : [];

    for (let item of tier1) {
        if (exclusions.indexOf(item.name) !== -1) {
            continue;
        }
        items.push(item);
    }

    let count = Math.ceil(tier1.length / 2);
    let selected = [];
    let sorter = (a, b) => {
        return a.category.localeCompare(b.category);
    };

    for (let i = 0; i < count; i++) {
        selected.push(...items.splice(Math.floor(Math.random() * items.length), 1));
    }

    selected.sort(sorter);

    for (let item of selected) {
        let img = new Image();
        img.src = `assets/img/tier_1/${item.name}.jpg`;

        $('body').append(img);
    }

});