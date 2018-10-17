"use strict";

var app = app || {};
app.constants = app.constants || {};

(function (app) {

    const ARMOR = "armor";
    const ITEM = "item";
    const UPGRADE_MELEE = "upgrade_melee";
    const UPGRADE_RANGED = "upgrade_ranged";
    const WEAPON_MELEE = "weapon_melee";
    const WEAPON_RANGED = "weapon_ranged";

    let tier1 = [
        {
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
            "name": "combat_vambrace",
            "category": ITEM
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
            "name": "punch_dagger",
            "category": WEAPON_MELEE
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
    ];

    let tier2 = [
        {
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
            "name": "dt_12_heavy_blaster_pistol",
            "category": WEAPON_RANGED
        },
        {
            "name": "e_11d",
            "category": WEAPON_RANGED
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
            "name": "mandalorian_helmet",
            "category": ITEM
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
    ];

    let tier3 = [
        {
            "name": "a_12_sniper_rifle",
            "category": WEAPON_RANGED
        },
        {
            "name": "admirals_uniform",
            "category": ARMOR
        },
        {
            "name": "ancient_lightsaber",
            "category": WEAPON_MELEE
        },
        {
            "name": "bo_rifle",
            "category": WEAPON_MELEE
        },
        {
            "name": "combat_knife",
            "category": ITEM
        },
        {
            "name": "combat_visor",
            "category": ITEM
        },
        {
            "name": "concussion_grenades",
            "category": ITEM
        },
        {
            "name": "disruption_cell",
            "category": UPGRADE_RANGED
        },
        {
            "name": "disruptor_pistol",
            "category": WEAPON_RANGED
        },
        {
            "name": "dlt_19",
            "category": WEAPON_RANGED
        },
        {
            "name": "dxr_6",
            "category": WEAPON_RANGED
        },
        {
            "name": "electrostaff",
            "category": WEAPON_MELEE
        },
        {
            "name": "force_pike",
            "category": WEAPON_MELEE
        },
        {
            "name": "hidden_blade",
            "category": ITEM
        },
        {
            "name": "laminate_armor",
            "category": ARMOR
        },
        {
            "name": "modified_energy_cannon",
            "category": WEAPON_RANGED
        },
        {
            "name": "personal_shields",
            "category": ITEM
        },
        {
            "name": "plastoid_armor",
            "category": ARMOR
        },
        {
            "name": "power_charger",
            "category": ITEM
        },
        {
            "name": "pulse_cannon",
            "category": WEAPON_RANGED
        },
        {
            "name": "reinforced_helmet",
            "category": ITEM
        },
        {
            "name": "ryyk_blades",
            "category": WEAPON_MELEE
        },
        {
            "name": "shock_emitter",
            "category": UPGRADE_MELEE
        },
        {
            "name": "sniper_scope",
            "category": UPGRADE_RANGED
        },
        {
            "name": "sporting_blaster",
            "category": WEAPON_RANGED
        },
        {
            "name": "supply_pack",
            "category": ITEM
        },

        {
            "name": "telescoping_sights",
            "category": UPGRADE_RANGED
        },
        {
            "name": "valken_38_carbine",
            "category": WEAPON_RANGED
        },
        {
            "name": "vibrogenerator",
            "category": UPGRADE_MELEE
        }
    ];

    app.constants.tiers = {
        1: tier1,
        2: tier2,
        3: tier3
    };

})(app);