/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class SurgeRecover3 extends Ability.BaseAbility {
                get id() {
                    return "surge_recover_3";
                }
                get name() {
                    return "SurgeRecover3";
                }
            }
            Ability.SurgeRecover3 = SurgeRecover3;
            Ability.loaded(new SurgeRecover3());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=surge_recover_3.js.map