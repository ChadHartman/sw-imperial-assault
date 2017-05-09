/// <reference path="../api/app.d.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class RangedAttack extends Ability.BaseAbility {
                constructor() {
                    super(...arguments);
                    this.id = "ranged_attack";
                    this.name = "Ranged Attack";
                    this.isAction = true;
                }
                executable(actor, ability, state) {
                    return new RangedAttackExecutable(actor, ability, state);
                }
            }
            Ability.RangedAttack = RangedAttack;
            class RangedAttackExecutable extends Game.Engine.ActionExecutable {
                constructor(actor, ability, state) {
                    super(actor, ability, state);
                    this.targetable = new Array();
                    this.target = null;
                    for (let army of state.armies) {
                        if (actor.zoneColor === army.zoneColor) {
                            continue;
                        }
                        for (let unit of army.units) {
                            if (state.los(actor, unit)) {
                                this.targetableUnits.push(unit);
                            }
                        }
                    }
                }
                get ready() {
                    return this.target !== null;
                }
                get targetableUnits() {
                    return this.targetable;
                }
                targetUnit(unit) {
                    if (this.targetable.indexOf(unit) === -1) {
                        return false;
                    }
                    this.target = unit;
                    return true;
                }
                execute() {
                    if (!this.ready) {
                        return Game.Engine.failure("Action is not ready");
                    }
                    let result = Game.Dice.roll(this.actor.deployment.attackDice, (this.target).deployment.defenseDice);
                    if (result.dodged) {
                        console.log("dodged!");
                        return Game.Engine.SUCCESS;
                    }
                    (this.target).health -= result.damage;
                    return Game.Engine.SUCCESS;
                }
            }
            Ability.RangedAttackExecutable = RangedAttackExecutable;
            Ability.loaded(new RangedAttack());
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
//# sourceMappingURL=ranged_attack.js.map