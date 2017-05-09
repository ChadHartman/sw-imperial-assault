/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class Order extends Ability.BaseAbility {
                get id() {
                    return "order";
                }
                get name() {
                    return "Order";
                }
            }
            Ability.Order = Order;
            Ability.loaded(new Order());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=order.js.map