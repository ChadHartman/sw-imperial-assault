$(document).ready(function () {

    // Tier 1
    let items = [{
            "name": "armored_gauntlets.jpg",
            "category": "weapon_melee"
        },
        {
            "name": "bacta_pump.jpg",
            "category": "item"
        },
        {
            "name": "balanced_hilt.jpg",
            "category": "upgrade_melee"
        },
        {
            "name": "charge_pistol.jpg",
            "category": "weapon_ranged"
        },
        {
            "name": "charged_ammo_pack.jpg",
            "category": "upgrade_ranged"
        },
        {
            "name": "combat_coat.jpg",
            "category": "armor"
        },
        {
            "name": "ddc_defender.jpg",
            "category": "weapon_ranged"
        },
        {
            "name": "dh_17.jpg",
            "category": "weapon_ranged"
        },
        {
            "name": "dl_44.jpg",
            "category": "weapon_ranged"
        },
        {
            "name": "e_11.jpg",
            "category": "weapon_ranged"
        },
        {
            "name": "emergency_injector.jpg",
            "category": "item"
        },
        {
            "name": "extended_haft.jpg",
            "category": "upgrade_melee"
        },
        {
            "name": "gaffi_stick.jpg",
            "category": "weapon_melee"
        },
        {
            "name": "hand_cannon.jpg",
            "category": "weapon_ranged"
        },
        {
            "name": "marksman_barrel.jpg",
            "category": "upgrade_ranged"
        },
        {
            "name": "portable_medkit.jpg",
            "category": "item"
        },
        {
            "name": "responsive_armor.jpg",
            "category": "armor"
        },
        {
            "name": "shadowsilk_cloak.jpg",
            "category": "armor"
        },
        {
            "name": "survival_gear.jpg",
            "category": "item"
        },
        {
            "name": "tactical_display.jpg",
            "category": "upgrade_ranged"
        },
        {
            "name": "tatooine_hunting_rifle.jpg",
            "category": "weapon_ranged"
        },
        {
            "name": "under_barrel_hh_4.jpg",
            "category": "upgrade_ranged"
        },
        {
            "name": "vibroblade.jpg",
            "category": "weapon_melee"
        },
        {
            "name": "vibroknife.jpg",
            "category": "weapon_melee"
        },
        {
            "name": "vibrosword.jpg",
            "category": "weapon_melee"
        }
    ];

    let count = Math.ceil(items.length / 2);
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
        img.src = `assets/img/tier_1/${item.name}`;

        $('body').append(img);
    }

});