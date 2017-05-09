/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class SelfDestruct extends Ability.BaseAbility {
                get id() {
                    return "self_destruct";
                }
                get name() {
                    return "SelfDestruct";
                }
            }
            Ability.SelfDestruct = SelfDestruct;
            Ability.loaded(new SelfDestruct());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=self_destruct.js.map