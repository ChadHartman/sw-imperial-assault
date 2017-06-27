"use strict";

var app = angular.module('builderApp', []);

app.getParameterByName = function (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

app.controller('BuilderController', ['$scope', '$location', function ($scope, $location) {

    $scope.message = app.getParameterByName("message");

    $scope.availableCards = [
        { name: "a_powerful_influence" },
        { name: "adrenaline" },
        { name: "advance_warning" },
        { name: "against_the_odds" },
        { name: "assassinate" },
        { name: "ballistics_matrix" },
        { name: "battlefield_awareness" },
        { name: "behind_enemy_lines" },
        { name: "black_market_prices" },
        { name: "bladestorm" },
        { name: "blaze_of_glory" },
        { name: "blitz" },
        { name: "blood_feud" },
        { name: "bodyguard" },
        { name: "brace_for_impact" },
        { name: "brace_yourself" },
        { name: "burst_fire" },
        { name: "call_the_vanguard" },
        { name: "camouflage" },
        { name: "capture_the_weary" },
        { name: "cavalry_charge" },
        { name: "celebration" },
        { name: "change_of_plans" },
        { name: "cheat_to_win" },
        { name: "close_the_gap" },
        { name: "collect_intel" },
        { name: "comm_disruption" },
        { name: "coordinated_attack" },
        { name: "counter_attack" },
        { name: "covering_fire" },
        { name: "cripple" },
        { name: "cruel_strike" },
        { name: "crush" },
        { name: "cut_lines" },
        { name: "dangerous_bargains" },
        { name: "data_theft" },
        { name: "deadeye" },
        { name: "deadly_precision" },
        { name: "debts_repaid" },
        { name: "deflection" },
        { name: "devotion" },
        { name: "dirty_trick" },
        { name: "disable" },
        { name: "disorient" },
        { name: "draw" },
        { name: "eerie_visage" },
        { name: "efficient_travel" },
        { name: "element_of_surprise" },
        { name: "emergency_aid" },
        { name: "endless_reserves" },
        { name: "espionage_mastery" },
        { name: "etiquette_and_protocol" },
        { name: "evacuate" },
        { name: "explosive_weaponry" },
        { name: "expose_weakness" },
        { name: "extra_protection" },
        { name: "fatal_deception" },
        { name: "feral_swipes" },
        { name: "ferocity" },
        { name: "field_tactician" },
        { name: "fleet_footed" },
        { name: "flurry_of_blades" },
        { name: "focus" },
        { name: "force_illusion" },
        { name: "force_lightning" },
        { name: "force_rush" },
        { name: "force_surge" },
        { name: "fuel_upgrade" },
        { name: "furious_charge" },
        { name: "glory_of_the_kill" },
        { name: "grenadier" },
        { name: "grisly_contest" },
        { name: "guardian_stance" },
        { name: "hard_to_hit" },
        { name: "harsh_environment" },
        { name: "heart_of_freedom" },
        { name: "heavy_armor" },
        { name: "heightened_reflexes" },
        { name: "hidden_trap" },
        { name: "hide_in_plain_sight" },
        { name: "hit_and_run" },
        { name: "hold_ground" },
        { name: "hunt_them_down" },
        { name: "hunter_protocol" },
        { name: "i_can_feel_it" },
        { name: "i_make_my_own_luck" },
        { name: "i_must_go_alone" },
        { name: "improvised_weapons" },
        { name: "in_the_shadows" },
        { name: "inspiring_speech" },
        { name: "intelligence_leak" },
        { name: "jump_jets" },
        { name: "jundland_terror" },
        { name: "knowledge_and_defense" },
        { name: "lock_on" },
        { name: "lord_of_the_sith" },
        { name: "lure_of_the_dark_side" },
        { name: "mandalorian_tactics" },
        { name: "marksman" },
        { name: "master_operative" },
        { name: "maximum_firepower" },
        { name: "meditation" },
        { name: "merciless" },
        { name: "miracle_worker" },
        { name: "mitigate" },
        { name: "navigation_upgrade" },
        { name: "negation" },
        { name: "new_orders" },
        { name: "of_no_importance" },
        { name: "on_a_mission" },
        { name: "on_the_lam" },
        { name: "one_in_a_million" },
        { name: "opportunistic" },
        { name: "optimal_bombardment" },
        { name: "overcharged_weapons" },
        { name: "overdrive" },
        { name: "overrun" },
        { name: "parry" },
        { name: "parting_blow" },
        { name: "payback" },
        { name: "pickpocket" },
        { name: "planning" },
        { name: "positioning_advantage" },
        { name: "price_on_their_heads" },
        { name: "primary_target" },
        { name: "provoke" },
        { name: "pummel" },
        { name: "rally" },
        { name: "rally_the_troops" },
        { name: "rank_and_file" },
        { name: "recovery" },
        { name: "regroup" },
        { name: "reinforcements" },
        { name: "repair" },
        { name: "reposition" },
        { name: "roar" },
        { name: "run_for_cover" },
        { name: "sarlacc_sweep" },
        { name: "self_defense" },
        { name: "set_a_trap" },
        { name: "set_for_stun" },
        { name: "shadow_ops" },
        { name: "shared_experience" },
        { name: "shoot_the_messenger" },
        { name: "single_purpose" },
        { name: "sit_tight" },
        { name: "size_advantage" },
        { name: "slippery_target" },
        { name: "smuggled_supplies" },
        { name: "smugglers_tricks" },
        { name: "son_of_skywalker" },
        { name: "squad_swarm" },
        { name: "stall_for_time" },
        { name: "stay_down" },
        { name: "stealth_tactics" },
        { name: "stimulants" },
        { name: "strategic_shift" },
        { name: "strength_in_numbers" },
        { name: "stroke_of_brilliance" },
        { name: "survival_instincts" },
        { name: "take_cover" },
        { name: "take_initiative" },
        { name: "take_it_down" },
        { name: "take_position" },
        { name: "targeting_network" },
        { name: "telekinetic_throw" },
        { name: "terminal_network" },
        { name: "terminal_protocol" },
        { name: "there_is_another" },
        { name: "to_the_limit" },
        { name: "tools_for_the_job" },
        { name: "tough_luck" },
        { name: "toxic_dart" },
        { name: "trandoshan_terror" },
        { name: "triangulate" },
        { name: "urgency" },
        { name: "utinni" },
        { name: "vanish" },
        { name: "wild_attack" },
        { name: "wild_fury" },
        { name: "wookie_rage" }
    ];

    $scope.deck = [];

    $scope.search = function () {
        $scope.availableCards.forEach(function (card) {
            if ($scope.searchTerm) {
                card.filteredOut = !card.name.includes($scope.searchTerm);
            } else {
                card.filteredOut = false;
            }
        });
    };

    $scope.clearSearch = function () {
        $scope.searchTerm = "";
        $scope.search();
    };

    $scope.addToDeck = function ($index) {
        $scope.deck.push($scope.availableCards[$index]);
    };

    $scope.removeFromDeck = function ($index) {
        $scope.deck.splice($index, 1);
    };

    $scope.saveDeck = function () {
        localStorage.deck = JSON.stringify($scope.deck);
        $scope.message = "Deck was saved";
        $scope.saved = true;
    };
}]);