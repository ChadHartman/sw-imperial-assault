var App;
(function (App) {
    var Game;
    (function (Game) {
        var Attack;
        (function (Attack) {
            var Phase;
            (function (Phase) {
                Phase[Phase["DECLARE_TARGET"] = 0] = "DECLARE_TARGET";
                Phase[Phase["REROLLS"] = 1] = "REROLLS";
                Phase[Phase["APPLY_MODIFIERS"] = 2] = "APPLY_MODIFIERS";
                Phase[Phase["SPEND_SURGES"] = 3] = "SPEND_SURGES";
                Phase[Phase["CALCULATE_DAMAGE"] = 4] = "CALCULATE_DAMAGE";
            })(Phase = Attack.Phase || (Attack.Phase = {}));
        })(Attack = Game.Attack || (Game.Attack = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));