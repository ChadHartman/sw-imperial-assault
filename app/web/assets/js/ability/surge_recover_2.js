/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class SurgeRecover2 extends Ability.BaseAbility {
                get id() {
                    return "surge_recover_2";
                }
                get name() {
                    return "SurgeRecover2";
                }
            }
            Ability.SurgeRecover2 = SurgeRecover2;
            Ability.loaded(new SurgeRecover2());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=surge_recover_2.js.map