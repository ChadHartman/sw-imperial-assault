$(document).ready(function () {

    // Tier 1
    let items = [
        "armored_gauntlets.jpg",
        "bacta_pump.jpg",
        "balanced_hilt.jpg",
        "charge_pistol.jpg",
        "charged_ammo_pack.jpg",
        "combat_coat.jpg",
        "ddc_defender.jpg",
        "dh_17.jpg",
        "dl_44.jpg",
        "e_11.jpg",
        "emergency_injector.jpg",
        "extended_haft.jpg",
        "gaffi_stick.jpg",
        "hand_cannon.jpg",
        "marksman_barrel.jpg",
        "portable_medkit.jpg",
        "responsive_armor.jpg",
        "shadowsilk_cloak.jpg",
        "survival_gear.jpg",
        "tactical_display.jpg",
        "tatooine_hunting_rifle.jpg",
        "under_barrel_hh_4.jpg",
        "vibroblade.jpg",
        "vibroknife.jpg",
        "vibrosword.jpg"
    ];

    let count = Math.ceil(items.length / 2);

    for (let i = 0; i < count; i++) {
        let item = items.splice(Math.floor(Math.random() * items.length), 1)[0];
        
        let img = new Image();
        img.src = `assets/img/tier_1/${item}`;
        
        $('body').append(img);
    }

});