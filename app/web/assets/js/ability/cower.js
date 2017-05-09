/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class Cower extends Ability.BaseAbility {
                get id() {
                    return "cower";
                }
                get name() {
                    return "Cower";
                }
            }
            Ability.Cower = Cower;
            Ability.loaded(new Cower());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=cower.js.map