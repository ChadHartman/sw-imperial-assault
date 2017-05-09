/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class SurgeAccuracy2 extends Ability.BaseAbility {
                get id() {
                    return "surge_accuracy_2";
                }
                get name() {
                    return "SurgeAccuracy2";
                }
            }
            Ability.SurgeAccuracy2 = SurgeAccuracy2;
            Ability.loaded(new SurgeAccuracy2());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=surge_accuracy_2.js.map