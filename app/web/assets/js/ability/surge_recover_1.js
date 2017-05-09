/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class SurgeRecover1 extends Ability.BaseAbility {
                get id() {
                    return "surge_recover_1";
                }
                get name() {
                    return "SurgeRecover1";
                }
            }
            Ability.SurgeRecover1 = SurgeRecover1;
            Ability.loaded(new SurgeRecover1());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=surge_recover_1.js.map