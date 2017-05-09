/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class Move extends Ability.BaseAbility {
                constructor() {
                    super(...arguments);
                    this.id = "move";
                    this.name = "Move";
                    this.isAction = true;
                }
                executable(actor, ability, state) {
                    return new MoveActionExecutable(actor, ability, state);
                }
            }
            Ability.Move = Move;
            class MoveActionExecutable extends Game.Engine.ActionExecutable {
                constructor(actor, ability, state) {
                    super(actor, ability, state);
                }
                get ready() {
                    return this.actor.actionCount > 0;
                }
                execute() {
                    if (this.ready) {
                        this.actor.movementPoints += this.actor.deployment.speed;
                        this.actor.actionCount--;
                        return Game.Engine.SUCCESS;
                    }
                    return Game.Engine.failure("Unit does not have enough actions");
                }
            }
            Ability.MoveActionExecutable = MoveActionExecutable;
            Ability.loaded(new Move());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=move.js.map