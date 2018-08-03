"use strict";

var app = app || {};

app.state = app.state || {};
app.state.filteredTiers = [];
app.state.filteredItems = [];
app.constants = app.constants || {};

(function (app) {

    const ARMOR = "armor";
    const ITEM = "item";
    const UPGRADE_MELEE = "upgrade_melee";
    const UPGRADE_RANGED = "upgrade_ranged";
    const WEAPON_MELEE = "weapon_melee";
    const WEAPON_RANGED = "weapon_ranged";

    app.constants.tiers = {
        1: [{
                "name": "armored_gauntlets",
                "category": WEAPON_MELEE
            },
            {
                "name": "bacta_pump",
                "category": ITEM
            },
            {
                "name": "balanced_hilt",
                "category": UPGRADE_MELEE
            },
            {
                "name": "charge_pistol",
                "category": WEAPON_RANGED
            },
            {
                "name": "charged_ammo_pack",
                "category": UPGRADE_RANGED
            },
            {
                "name": "combat_coat",
                "category": ARMOR
            },
            {
                "name": "ddc_defender",
                "category": WEAPON_RANGED
            },
            {
                "name": "dh_17",
                "category": WEAPON_RANGED
            },
            {
                "name": "dl_44",
                "category": WEAPON_RANGED
            },
            {
                "name": "e_11",
                "category": WEAPON_RANGED
            },
            {
                "name": "emergency_injector",
                "category": ITEM
            },
            {
                "name": "extended_haft",
                "category": UPGRADE_MELEE
            },
            {
                "name": "gaffi_stick",
                "category": WEAPON_MELEE
            },
            {
                "name": "hand_cannon",
                "category": WEAPON_RANGED,
            },
            {
                "name": "marksman_barrel",
                "category": UPGRADE_RANGED,
            },
            {
                "name": "portable_medkit",
                "category": ITEM
            },
            {
                "name": "responsive_armor",
                "category": ARMOR
            },
            {
                "name": "shadowsilk_cloak",
                "category": ARMOR
            },
            {
                "name": "survival_gear",
                "category": ITEM
            },
            {
                "name": "tactical_display",
                "category": UPGRADE_RANGED
            },
            {
                "name": "tatooine_hunting_rifle",
                "category": WEAPON_RANGED
            },
            {
                "name": "under_barrel_hh_4",
                "category": UPGRADE_RANGED
            },
            {
                "name": "vibroblade",
                "category": WEAPON_MELEE
            },
            {
                "name": "vibroknife",
                "category": WEAPON_MELEE
            },
            {
                "name": "vibrosword",
                "category": WEAPON_MELEE
            }
        ],
        2: [{
                "name": "434_deathhammer",
                "category": WEAPON_RANGED
            },
            {
                "name": "a280",
                "category": WEAPON_RANGED
            },
            {
                "name": "bd_1_vibro_ax",
                "category": WEAPON_MELEE
            },
            {
                "name": "bolt_upgrade",
                "category": UPGRADE_RANGED
            },
            {
                "name": "combat_coat",
                "category": ARMOR
            },
            {
                "name": "cybernetic_arm",
                "category": ITEM
            },
            {
                "name": "double_vibrosword",
                "category": WEAPON_MELEE
            },
            {
                "name": "ee_3_carbine",
                "category": WEAPON_RANGED
            },
            {
                "name": "energized_hilt",
                "category": UPGRADE_MELEE
            },
            {
                "name": "environmental_hazard_suit",
                "category": ARMOR
            },
            {
                "name": "extra_ammunition",
                "category": ITEM
            },
            {
                "name": "focusing_beam",
                "category": UPGRADE_MELEE
            },
            {
                "name": "high_impact_guard",
                "category": UPGRADE_MELEE
            },
            {
                "name": "hunters_rifle",
                "category": WEAPON_RANGED
            },
            {
                "name": "laminate_armor",
                "category": ARMOR
            },
            {
                "name": "overcharger",
                "category": UPGRADE_RANGED
            },
            {
                "name": "plasma_cell",
                "category": UPGRADE_RANGED
            },
            {
                "name": "polearm",
                "category": WEAPON_MELEE
            },
            {
                "name": "r5_astromech",
                "category": ITEM
            },
            {
                "name": "slicing_tools",
                "category": ITEM
            },
            {
                "name": "spread_barrel",
                "category": UPGRADE_RANGED
            },
            {
                "name": "stun_baton",
                "category": WEAPON_MELEE
            },
            {
                "name": "t_21",
                "category": WEAPON_RANGED
            },
            {
                "name": "vibro_knucklers",
                "category": WEAPON_MELEE
            },
            {
                "name": "weighted_head",
                "category": UPGRADE_MELEE
            }
        ],
        3: [{
                "name": "a_12_sniper_rifle",
                "category": WEAPON_RANGED
            },
            {
                "name": "admirals_uniform",
                "category": ARMOR
            },
            {
                "name": "personal_shields",
                "category": ITEM
            },
            {
                "name": "combat_knife",
                "category": ITEM
            },
            {
                "name": "power_charger",
                "category": ITEM
            },
            {
                "name": "combat_visor",
                "category": ITEM
            },
            {
                "name": "pulse_cannon",
                "category": WEAPON_RANGED
            },
            {
                "name": "concussion_grenades",
                "category": ITEM
            },
            {
                "name": "reinforced_helmet",
                "category": ITEM
            },
            {
                "name": "disruption_cell",
                "category": UPGRADE_RANGED
            },
            {
                "name": "ryyk_blades",
                "category": WEAPON_MELEE
            },
            {
                "name": "disruptor_pistol",
                "category": WEAPON_RANGED
            },
            {
                "name": "shock_emitter",
                "category": UPGRADE_MELEE
            },
            {
                "name": "dlt_19",
                "category": WEAPON_RANGED
            },
            {
                "name": "sniper_scope",
                "category": UPGRADE_RANGED
            },
            {
                "name": "dxr_6",
                "category": WEAPON_RANGED
            },
            {
                "name": "sporting_blaster",
                "category": WEAPON_RANGED
            },
            {
                "name": "force_pike",
                "category": WEAPON_MELEE
            },
            {
                "name": "supply_pack",
                "category": ITEM
            },
            {
                "name": "hidden_blade",
                "category": ITEM
            },
            {
                "name": "telescoping_sights",
                "category": UPGRADE_RANGED
            },
            {
                "name": "laminate_armor",
                "category": ARMOR
            },
            {
                "name": "valken_38_carbine",
                "category": WEAPON_RANGED
            },
            {
                "name": "modified_energy_cannon",
                "category": WEAPON_RANGED
            },
            {
                "name": "vibrogenerator",
                "category": UPGRADE_MELEE
            }
        ]
    };
})(app);

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