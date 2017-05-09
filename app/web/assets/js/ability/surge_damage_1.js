/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class SurgeDamage1 extends Ability.BaseAbility {
                get id() {
                    return "surge_damage_1";
                }
                get name() {
                    return "SurgeDamage1";
                }
            }
            Ability.SurgeDamage1 = SurgeDamage1;
            Ability.loaded(new SurgeDamage1());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=surge_damage_1.js.map