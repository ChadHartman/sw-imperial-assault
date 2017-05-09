/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class SurgeFocus extends Ability.BaseAbility {
                get id() {
                    return "surge_focus";
                }
                get name() {
                    return "SurgeFocus";
                }
            }
            Ability.SurgeFocus = SurgeFocus;
            Ability.loaded(new SurgeFocus());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=surge_focus.js.map