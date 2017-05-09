/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class SquadTraining extends Ability.BaseAbility {
                get id() {
                    return "squad_training";
                }
                get name() {
                    return "SquadTraining";
                }
            }
            Ability.SquadTraining = SquadTraining;
            Ability.loaded(new SquadTraining());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=squad_training.js.map