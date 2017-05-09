/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class SurgePierce1 extends Ability.BaseAbility {
                get id() {
                    return "surge_pierce_1";
                }
                get name() {
                    return "SurgePierce1";
                }
            }
            Ability.SurgePierce1 = SurgePierce1;
            Ability.loaded(new SurgePierce1());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=surge_pierce_1.js.map