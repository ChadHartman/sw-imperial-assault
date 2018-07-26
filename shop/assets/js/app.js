"use strict";

var app = app || {};

app.state = app.state || {};
app.state.filteredTiers = [];
app.state.filteredItems = [];
app.constants = app.constants || {};

app.constants.tiers = {
    1: [{
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
            "category": "weapon_ranged",
        },
        {
            "name": "marksman_barrel",
            "category": "upgrade_ranged",
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
    ],
    2: [{
            "name": "434_deathhammer",
            "category": "weapon_ranged"
        },
        {
            "name": "a280",
            "category": "weapon_ranged"
        },
        {
            "name": "bd_1_vibro_ax",
            "category": "weapon_melee"
        },
        {
            "name": "bolt_upgrade",
            "category": "upgrade_ranged"
        },
        {
            "name": "combat_coat",
            "category": "armor"
        },
        {
            "name": "cybernetic_arm",
            "category": "item"
        },
        {
            "name": "double_vibrosword",
            "category": "weapon_melee"
        },
        {
            "name": "ee_3_carbine",
            "category": "weapon_ranged"
        },
        {
            "name": "energized_hilt",
            "category": "upgrade_melee"
        },
        {
            "name": "environmental_hazard_suit",
            "category": "armor"
        },
        {
            "name": "extra_ammunition",
            "category": "item"
        },
        {
            "name": "focusing_beam",
            "category": "upgrade_melee"
        },
        {
            "name": "high_impact_guard",
            "category": "upgrade_melee"
        },
        {
            "name": "hunters_rifle",
            "category": "weapon_ranged"
        },
        {
            "name": "laminate_armor",
            "category": "armor"
        },
        {
            "name": "overcharger",
            "category": "upgrade_ranged"
        },
        {
            "name": "plasma_cell",
            "category": "upgrade_ranged"
        },
        {
            "name": "polearm",
            "category": "weapon_melee"
        },
        {
            "name": "r5_astromech",
            "category": "item"
        },
        {
            "name": "slicing_tools",
            "category": "item"
        },
        {
            "name": "spread_barrel",
            "category": "upgrade_ranged"
        },
        {
            "name": "stun_baton",
            "category": "weapon_melee"
        },
        {
            "name": "t_21",
            "category": "weapon_ranged"
        },
        {
            "name": "vibro_knucklers",
            "category": "weapon_melee"
        },
        {
            "name": "weighted_head",
            "category": "upgrade_melee"
        }
    ],
    3: []
};

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


let s = new Set();
for (let tierId in app.constants.tiers) {
    for (let item of app.constants.tiers[tierId]) {
        s.add(item.category);
    }
}
console.log(s);