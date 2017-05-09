"use strict";
var App;
(function (App) {
    App.debug = {};
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            const cache = new Array();
            let tasks = new Array();
            function dequeue() {
                let queue = tasks;
                tasks = new Array();
                while (queue.length > 0) {
                    let task = queue.pop();
                    let found = false;
                    for (let ability of cache) {
                        if (ability.id === task.id) {
                            task.listener.onAbilityLoad(ability);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        tasks.push(task);
                    }
                }
            }
            function loaded(ability) {
                cache.push(ability);
                dequeue();
            }
            Ability.loaded = loaded;
            function ability(id, listener) {
                tasks.push({
                    id: id,
                    listener: listener
                });
                // Seperate loop
                setTimeout(dequeue, 0);
            }
            Ability.ability = ability;
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Ability;
        (function (Ability) {
            class BaseAbility {
                constructor() {
                    this.isAction = false;
                    this.isSpecialAction = false;
                }
                executable(actor, ability, state) {
                    throw new Error('This ability has no executable');
                }
            }
            Ability.BaseAbility = BaseAbility;
        })(Ability = Game.Ability || (Game.Ability = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var ActivationState;
        (function (ActivationState) {
            ActivationState[ActivationState["READY"] = 0] = "READY";
            ActivationState[ActivationState["ACTIVE_WAITING"] = 1] = "ACTIVE_WAITING";
            ActivationState[ActivationState["ACTIVE"] = 2] = "ACTIVE";
            ActivationState[ActivationState["EXAUSTED"] = 3] = "EXAUSTED";
        })(ActivationState = Game.ActivationState || (Game.ActivationState = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        function deploymentSorter(a, b) {
            return a.id.localeCompare(b.id);
        }
        class Army {
            constructor(id, title, zoneColor, deployments) {
                this.id = id;
                this.title = title;
                let groupId = 1;
                this.zoneColor = zoneColor;
                this.units = [];
                this.groups = [];
                // Sorting ensures that group ids will be assigned consistently
                deployments = deployments.sort(deploymentSorter);
                for (let deployment of deployments) {
                    let group = new Game.Group(groupId, zoneColor);
                    this.groups.push(group);
                    for (let i = 1; i <= deployment.groupSize; i++) {
                        let unit = new Game.Unit(i, groupId, zoneColor, deployment);
                        this.units.push(unit);
                        group.units.push(unit);
                    }
                    groupId++;
                }
            }
        }
        Game.Army = Army;
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
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
            function rollAttack(id, die) {
                let side = die.roll();
                return { id: id, die: die, side: side, rerolled: false };
            }
            function rollDefense(id, name) {
                let die = Game.Dice.defenseDie(name);
                let side = die.roll();
                return { id: id, die: die, side: side, rerolled: false };
            }
            class BaseAttack {
                constructor(attacker, state) {
                    this.attacker = attacker;
                    this._target = null;
                    this.state = state;
                    this.attackRoll = new Array();
                    this.defenseRoll = new Array();
                    this.modifiers = new Array();
                    this.surges = new Array();
                    this._phase = Phase.DECLARE_TARGET;
                    App.debug["attack"] = this;
                }
                set target(target) {
                    if (target === null) {
                        throw new Error("Cannot set target to null");
                    }
                    if (this._phase !== Phase.DECLARE_TARGET) {
                        throw new Error(`Invalid phase: ${Phase[this._phase]}`);
                    }
                    if (!this.targetable(target)) {
                        throw new Error(`${target.uniqueId} is not targetable`);
                    }
                    this._target = target;
                    let dieId = 1;
                    for (let die of this.attacker.deployment.attackDice) {
                        this.attackRoll.push(rollAttack(dieId++, die));
                    }
                    for (let die of target.deployment.defenseDice) {
                        this.defenseRoll.push(rollDefense(dieId++, die));
                    }
                    this._phase = Phase.REROLLS;
                }
                reroll(id) {
                    if (this._phase > Phase.REROLLS) {
                        throw new Error(`Invalid attack phase ${Phase[this._phase]}`);
                    }
                    for (let roll of this.attackRoll) {
                        if (roll.id === id) {
                            if (roll.rerolled) {
                                throw new Error("Die has already been rerolled");
                            }
                            roll.side = roll.die.roll();
                            roll.rerolled = true;
                            return;
                        }
                    }
                    for (let roll of this.defenseRoll) {
                        if (roll.id === id) {
                            if (roll.rerolled) {
                                throw new Error("Die has already been rerolled");
                            }
                            roll.side = roll.die.roll();
                            roll.rerolled = true;
                            return;
                        }
                    }
                    throw new Error(`Invalid die id: ${id}`);
                }
                applyModifier(modifier) {
                    if (this._phase < Phase.APPLY_MODIFIERS) {
                        this._phase = Phase.APPLY_MODIFIERS;
                    }
                    else if (this._phase > Phase.APPLY_MODIFIERS) {
                        throw new Error(`Invalid attack phase ${Phase[this._phase]}`);
                    }
                    this.modifiers.push(modifier);
                }
                isSurgeSpendable(surge) {
                    if (this._phase > Phase.SPEND_SURGES) {
                        return false;
                    }
                    for (let spent of this.surges) {
                        if (spent.id === surge.id) {
                            return false;
                        }
                    }
                    return this.surge >= surge.cost;
                }
                spendSurge(surge) {
                    if (this._phase < Phase.SPEND_SURGES) {
                        this._phase = Phase.SPEND_SURGES;
                    }
                    else if (this._phase > Phase.SPEND_SURGES) {
                        throw new Error(`Invalid attack phase ${Phase[this._phase]}`);
                    }
                    if (!this.isSurgeSpendable(surge)) {
                        throw new Error(`Cannot spend`);
                    }
                    this.surges.push(surge);
                }
                get target() {
                    return this._target;
                }
                get damage() {
                    let total = 0;
                    for (let roll of this.attackRoll) {
                        total += roll.side.damage;
                    }
                    for (let roll of this.defenseRoll) {
                        total -= roll.side.block;
                    }
                    for (let modifier of this.modifiers) {
                        if (modifier.type === Game.Attribute.DAMAGE) {
                            total += modifier.value;
                        }
                    }
                    for (let surge of this.surges) {
                        for (let modifier of surge.modifiers) {
                            if (modifier.type === Game.Attribute.DAMAGE) {
                                total += modifier.value;
                            }
                        }
                    }
                    return total < 0 ? 0 : total;
                }
                get surge() {
                    let total = 0;
                    for (let roll of this.attackRoll) {
                        total += roll.side.surge;
                    }
                    for (let roll of this.defenseRoll) {
                        total -= roll.side.evade;
                    }
                    for (let modifier of this.modifiers) {
                        if (modifier.type === Game.Attribute.SURGE) {
                            total += modifier.value;
                        }
                    }
                    for (let surge of this.surges) {
                        total -= surge.cost;
                    }
                    return total < 0 ? 0 : total;
                }
                get phase() {
                    return this._phase;
                }
                get dodged() {
                    let total = 0;
                    for (let roll of this.defenseRoll) {
                        total += roll.side.dodge;
                    }
                    for (let modifier of this.modifiers) {
                        if (modifier.type === Game.Attribute.DODGE) {
                            total += modifier.value;
                        }
                    }
                    for (let surge of this.surges) {
                        for (let modifier of surge.modifiers) {
                            if (modifier.type === Game.Attribute.DODGE) {
                                total += modifier.value;
                            }
                        }
                    }
                    return total > 0;
                }
                get accuracy() {
                    let total = 0;
                    for (let roll of this.attackRoll) {
                        total += roll.side.range;
                    }
                    for (let modifier of this.modifiers) {
                        if (modifier.type === Game.Attribute.ACCURACY) {
                            total += modifier.value;
                        }
                    }
                    for (let surge of this.surges) {
                        for (let modifier of surge.modifiers) {
                            if (modifier.type === Game.Attribute.ACCURACY) {
                                total += modifier.value;
                            }
                        }
                    }
                    return total;
                }
                result() {
                    this._phase = Phase.CALCULATE_DAMAGE;
                    if (!this.inRange(this.accuracy) || this.dodged) {
                        // TODO: recovery modifiers
                        return { damage: 0 };
                    }
                    let total = 0;
                    for (let roll of this.attackRoll) {
                        total += roll.side.damage;
                    }
                    for (let roll of this.defenseRoll) {
                        total -= roll.side.block;
                    }
                    let statusEffects = null;
                    for (let modifier of this.modifiers) {
                        if (modifier.type === Game.Attribute.STATUS) {
                            if (statusEffects === null) {
                                statusEffects = new Set();
                            }
                            statusEffects.add(modifier.status);
                        }
                    }
                    for (let surge of this.surges) {
                        for (let modifier of surge.modifiers) {
                            if (modifier.type === Game.Attribute.STATUS) {
                                if (statusEffects === null) {
                                    statusEffects = new Set();
                                }
                                statusEffects.add(modifier.status);
                            }
                        }
                    }
                    return { damage: total, status_effects: statusEffects };
                }
            }
            Attack.BaseAttack = BaseAttack;
        })(Attack = Game.Attack || (Game.Attack = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
/// <reference path="BaseAttack.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Attack;
        (function (Attack) {
            class MeleeAttack extends Attack.BaseAttack {
                inRange(accuracy) {
                    // TODO
                    return this.state.distance(this.attacker, this.target) <= accuracy;
                }
                targetable(defender) {
                    // TODO
                    if (this.attacker.zoneColor === defender.zoneColor) {
                        return false;
                    }
                    if (!this.state.los(this.attacker, defender)) {
                        return false;
                    }
                    return true;
                }
            }
            Attack.MeleeAttack = MeleeAttack;
        })(Attack = Game.Attack || (Game.Attack = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
/// <reference path="BaseAttack.ts"/>
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Attack;
        (function (Attack) {
            class RangedAttack extends Attack.BaseAttack {
                inRange(accuracy) {
                    return this.state.distance(this.attacker, this.target) <= accuracy;
                }
                targetable(defender) {
                    if (this.attacker.zoneColor === defender.zoneColor) {
                        return false;
                    }
                    if (!this.state.los(this.attacker, defender)) {
                        return false;
                    }
                    return true;
                }
            }
            Attack.RangedAttack = RangedAttack;
        })(Attack = Game.Attack || (Game.Attack = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Attribute;
        (function (Attribute) {
            Attribute[Attribute["SURGE"] = 0] = "SURGE";
            Attribute[Attribute["DAMAGE"] = 1] = "DAMAGE";
            Attribute[Attribute["BLOCK"] = 2] = "BLOCK";
            Attribute[Attribute["EVADE"] = 3] = "EVADE";
            Attribute[Attribute["ACCURACY"] = 4] = "ACCURACY";
            Attribute[Attribute["DODGE"] = 5] = "DODGE";
            Attribute[Attribute["STATUS"] = 6] = "STATUS";
            Attribute[Attribute["RECOVER"] = 7] = "RECOVER";
            Attribute[Attribute["PIERCE"] = 8] = "PIERCE";
        })(Attribute = Game.Attribute || (Game.Attribute = {}));
        (function (Attribute) {
            function parse(name) {
                let attr = Attribute[name.toUpperCase()];
                if (attr !== undefined) {
                    return attr;
                }
                throw new Error(`Unknown attribute: ${name}`);
            }
            Attribute.parse = parse;
        })(Attribute = Game.Attribute || (Game.Attribute = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var AttackType;
        (function (AttackType) {
            AttackType[AttackType["NONE"] = 0] = "NONE";
            AttackType[AttackType["RANGED"] = 1] = "RANGED";
            AttackType[AttackType["MELEE"] = 2] = "MELEE";
        })(AttackType = Game.AttackType || (Game.AttackType = {}));
        (function (AttackType) {
            function parse(name) {
                let value = AttackType[name.toUpperCase()];
                if (value === undefined) {
                    throw new Error(`Invalid AttackType: ${name}`);
                }
                return value;
            }
            AttackType.parse = parse;
        })(AttackType = Game.AttackType || (Game.AttackType = {}));
        class Deployment {
            constructor(id, image, data, abilities) {
                this.id = id;
                this.id = id;
                this.title = data.title;
                this.rank = data.rank;
                this.image = image;
                this.health = data.health;
                this.abilities = abilities;
                this.groupSize = data.group_size;
                this.speed = data.speed;
                this.attackDice = new Array();
                this.defenseDice = data.defense || [];
                this.surges = new Array();
                if (data.surges) {
                    let surgeId = 1;
                    for (let surge of data.surges) {
                        this.surges.push(new Game.Surge(surgeId++, surge));
                    }
                }
                if (data.attack) {
                    this.attackType = AttackType.parse(data.attack.type);
                    for (let die of data.attack.dice) {
                        this.attackDice.push(Game.Dice.attackDie(die));
                    }
                }
                else {
                    this.attackType = AttackType.NONE;
                }
            }
        }
        Game.Deployment = Deployment;
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Dice;
        (function (Dice) {
            class AttackDie {
                constructor(name, sides) {
                    this.name = name;
                    this.sides = sides;
                }
                roll() {
                    let index = Math.floor(Math.random() * this.sides.length);
                    return this.sides[index];
                }
            }
            Dice.AttackDie = AttackDie;
            Dice.RED = new AttackDie("red", [
                { damage: 1, surge: 0, range: 0, index: 0 },
                { damage: 2, surge: 0, range: 0, index: 1 },
                { damage: 2, surge: 0, range: 0, index: 2 },
                { damage: 2, surge: 1, range: 0, index: 3 },
                { damage: 3, surge: 0, range: 0, index: 4 },
                { damage: 3, surge: 0, range: 0, index: 5 }
            ]);
            Dice.BLUE = new AttackDie("blue", [
                { damage: 0, surge: 1, range: 2, index: 0 },
                { damage: 1, surge: 0, range: 2, index: 1 },
                { damage: 2, surge: 0, range: 3, index: 2 },
                { damage: 1, surge: 1, range: 3, index: 3 },
                { damage: 2, surge: 0, range: 4, index: 4 },
                { damage: 1, surge: 0, range: 5, index: 5 }
            ]);
            Dice.GREEN = new AttackDie("green", [
                { damage: 0, surge: 1, range: 1, index: 0 },
                { damage: 1, surge: 1, range: 1, index: 1 },
                { damage: 2, surge: 0, range: 1, index: 2 },
                { damage: 1, surge: 1, range: 2, index: 3 },
                { damage: 2, surge: 0, range: 2, index: 4 },
                { damage: 2, surge: 0, range: 3, index: 5 }
            ]);
            Dice.YELLOW = new AttackDie("yellow", [
                { damage: 0, surge: 1, range: 0, index: 0 },
                { damage: 1, surge: 2, range: 0, index: 1 },
                { damage: 2, surge: 0, range: 1, index: 2 },
                { damage: 1, surge: 1, range: 1, index: 3 },
                { damage: 0, surge: 1, range: 2, index: 4 },
                { damage: 1, surge: 0, range: 2, index: 5 }
            ]);
        })(Dice = Game.Dice || (Game.Dice = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Dice;
        (function (Dice) {
            class DefenseDie {
                constructor(name, sides) {
                    this.name = name;
                    this.sides = sides;
                }
                roll() {
                    let index = Math.floor(Math.random() * this.sides.length);
                    return this.sides[index];
                }
            }
            Dice.DefenseDie = DefenseDie;
            Dice.BLACK = new DefenseDie("black", [
                { block: 1, evade: 0, dodge: 0, index: 0 },
                { block: 1, evade: 0, dodge: 0, index: 1 },
                { block: 2, evade: 0, dodge: 0, index: 2 },
                { block: 2, evade: 0, dodge: 0, index: 3 },
                { block: 3, evade: 0, dodge: 0, index: 4 },
                { block: 0, evade: 1, dodge: 0, index: 5 }
            ]);
            Dice.WHITE = new DefenseDie("white", [
                { block: 0, evade: 0, dodge: 0, index: 0 },
                { block: 1, evade: 0, dodge: 0, index: 1 },
                { block: 0, evade: 1, dodge: 0, index: 2 },
                { block: 1, evade: 1, dodge: 0, index: 3 },
                { block: 1, evade: 1, dodge: 0, index: 4 },
                { block: 0, evade: 0, dodge: 1, index: 5 }
            ]);
        })(Dice = Game.Dice || (Game.Dice = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Dice;
        (function (Dice) {
            function attackDie(name) {
                switch (name) {
                    case "red":
                        return Dice.RED;
                    case "green":
                        return Dice.GREEN;
                    case "blue":
                        return Dice.BLUE;
                    case "yellow":
                        return Dice.YELLOW;
                }
                throw new Error(`Unknown attack die: ${name}`);
            }
            Dice.attackDie = attackDie;
            function defenseDie(name) {
                switch (name) {
                    case "black":
                        return Dice.BLACK;
                    case "white":
                        return Dice.WHITE;
                }
                throw new Error(`Unknown defense die: ${name}`);
            }
            Dice.defenseDie = defenseDie;
        })(Dice = Game.Dice || (Game.Dice = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
// namespace App.Game.Dice {
"use strict";
//     export interface IAttackResult {
//         name: string;
//         side: IAttackSide;
//     }
//     export interface IDefenseResult {
//         name: string;
//         side: IDefenseSide;
//     }
//     export interface IRollResult {
//         attack: Array<IAttackResult>;
//         defense: Array<IDefenseResult>;
//         damage: number;
//         surge: number;
//         range: number;
//         dodged: boolean;
//     }
//     export function roll(attackDice: Array<string>, defenseDice: Array<string>): IRollResult {
//         let result = {
//             attack: new Array<IAttackResult>(),
//             defense: new Array<IDefenseResult>(),
//             damage: 0,
//             surge: 0,
//             range: 0,
//             dodged: false
//         };
//         for (let name of attackDice) {
//             let attackDie = getAttackDie(name);
//             let side = attackDie.roll();
//             result.attack.push({ name: attackDie.name, side: side });
//             result.damage += side.damage;
//             result.surge += side.surge;
//             result.range += side.range;
//         }
//         for (let name of defenseDice) {
//             let defenseDie = getDefenseDie(name);
//             let side = defenseDie.roll();
//             result.defense.push({ name: defenseDie.name, side: side });
//             if (side.dodge > 0) {
//                 result.dodged = true;
//             }
//             result.damage -= side.block;
//             result.surge -= side.evade;
//         }
//         return result;
//     }
//     function getAttackDie(name: string): AttackDie {
//         switch (name) {
//             case "red":
//                 return RED;
//             case "green":
//                 return GREEN;
//             case "blue":
//                 return BLUE;
//             case "yellow":
//                 return YELLOW;
//         }
//         throw new Error(`Unknown attack die: ${name}`);
//     }
//     function getDefenseDie(name: string): DefenseDie {
//         switch (name) {
//             case "black":
//                 return BLACK;
//             case "white":
//                 return WHITE;
//         }
//         throw new Error(`Unknown defense die: ${name}`);
//     }
// } 
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Engine;
        (function (Engine) {
            const NO_UNITS = new Array();
            const NO_SPACES = new Array();
            class ActionExecutable {
                constructor(actor, ability, state) {
                    this.actor = actor;
                    this.ability = ability;
                    this.state = state;
                }
                get targetableUnits() {
                    return NO_UNITS;
                }
                get targetableSpaces() {
                    return NO_SPACES;
                }
                targetUnit(unit) {
                    return false;
                }
                targetSpace(space) {
                    return false;
                }
            }
            Engine.ActionExecutable = ActionExecutable;
        })(Engine = Game.Engine || (Game.Engine = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Engine;
        (function (Engine) {
            class GameEngine {
                constructor(gameState) {
                    this.state = gameState;
                    this.deploy();
                    window.engine = this;
                }
                activate(unit) {
                    if (this.state.activeGroup !== null) {
                        if (unit.activeWaiting && unit.groupId == this.state.activeGroup.id) {
                            // The unit can activate
                            if (this.state.activeGroup.activeUnit !== null) {
                                return Engine.failure("There's already an active unit");
                            }
                            unit.state = Game.ActivationState.ACTIVE;
                            return { success: true };
                        }
                        return Engine.failure(`There's already an active group`);
                    }
                    let group = this.state.group(unit.zoneColor, unit.groupId);
                    if (group.exausted) {
                        return Engine.failure("That group is exausted");
                    }
                    if (this.state.activeZone !== group.zoneColor) {
                        return Engine.failure(`It's not ${unit.zoneColor}'s turn`);
                    }
                    group.activate(unit.id);
                    return Engine.SUCCESS;
                }
                exaust(unit) {
                    if (unit.state !== Game.ActivationState.ACTIVE) {
                        return Engine.failure("Unit is not active");
                    }
                    unit.state = Game.ActivationState.EXAUSTED;
                    let group = this.state.group(unit.zoneColor, unit.groupId);
                    this.checkRound();
                    return Engine.SUCCESS;
                }
                move(unit, spaces) {
                    let initialX = unit.x;
                    let initialY = unit.y;
                    let cost = 0;
                    for (let space of spaces) {
                        if (Engine.Util.accessible(unit.x, unit.y, space.x, space.y, this.state.skirmish.spaces)) {
                            unit.x = space.x;
                            unit.y = space.y;
                            cost++;
                        }
                        else {
                            unit.x = initialX;
                            unit.y = initialY;
                            return Engine.failure(`${space.x},${space.y} is not accessible to the unit`);
                        }
                    }
                    unit.movementPoints -= cost;
                    return Engine.SUCCESS;
                }
                beginAttack(actor) {
                    switch (actor.deployment.attackType) {
                        case Game.AttackType.MELEE:
                            return new Game.Attack.MeleeAttack(actor, this.state);
                        case Game.AttackType.RANGED:
                            return new Game.Attack.RangedAttack(actor, this.state);
                    }
                    throw new Error(`${actor.uniqueId} has no attack `);
                }
                deploy() {
                    for (let army of this.state.armies) {
                        for (let unit of army.units) {
                            if (unit.x !== 0 || unit.y !== 0) {
                                // already deployed
                                continue;
                            }
                            let zone = this.getDeploymentZone(unit.zoneColor);
                            for (let space of zone.spaces) {
                                if (!this.state.occupied(space.x, space.y)) {
                                    unit.x = space.x;
                                    unit.y = space.y;
                                    break;
                                }
                            }
                        }
                    }
                }
                getDeploymentZone(zoneColor) {
                    for (let zone of this.state.skirmish.deploymentZones) {
                        if (Game.toZoneColor(zone.color) === zoneColor) {
                            return zone;
                        }
                    }
                    throw new Error(`Cannot find zone with color:${Game.ZoneColor[zoneColor]}`);
                }
                checkRound() {
                    for (let army of this.state.armies) {
                        for (let group of army.groups) {
                            if (!group.exausted) {
                                // There are more groups to go
                                return;
                            }
                        }
                    }
                    this.state.round++;
                    for (let army of this.state.armies) {
                        for (let group of army.groups) {
                            group.ready();
                        }
                    }
                }
            }
            Engine.GameEngine = GameEngine;
        })(Engine = Game.Engine || (Game.Engine = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Engine;
        (function (Engine) {
            function armySorter(a, b) {
                return a.zoneColor - b.zoneColor;
            }
            /**
             * Should never mutate itself
             */
            class GameState {
                constructor(skirmish, armies, initiative) {
                    this.skirmish = skirmish;
                    this.armies = armies;
                    this.armies.sort(armySorter);
                    this.initiative = initiative;
                    this.round = 1;
                    this.losService = new Engine.Util.LosService(this);
                }
                get activeUnit() {
                    for (let army of this.armies) {
                        for (let unit of army.units) {
                            if (unit.state === Game.ActivationState.ACTIVE) {
                                return unit;
                            }
                        }
                    }
                    return null;
                }
                get activeGroup() {
                    for (let army of this.armies) {
                        for (let group of army.groups) {
                            if (group.state === Game.ActivationState.ACTIVE) {
                                return group;
                            }
                        }
                    }
                    return null;
                }
                unit(id) {
                    for (let army of this.armies) {
                        for (let unit of army.units) {
                            if (unit.uniqueId === id) {
                                return unit;
                            }
                        }
                    }
                    throw new Error(`No unit with id ${id}.`);
                }
                group(zoneColor, groupId) {
                    for (let army of this.armies) {
                        if (army.zoneColor !== zoneColor) {
                            continue;
                        }
                        for (let group of army.groups) {
                            if (group.id === groupId) {
                                return group;
                            }
                        }
                    }
                    throw new Error(`No group found with id: ${groupId}`);
                }
                space(x, y) {
                    if (!this.skirmish) {
                        return null;
                    }
                    return Engine.Util.findSpace(x, y, this.skirmish.spaces);
                }
                unitAt(x, y) {
                    for (let army of this.armies) {
                        for (let unit of army.units) {
                            if (unit.x === x && unit.y === y) {
                                return unit;
                            }
                        }
                    }
                    return null;
                }
                occupied(x, y) {
                    return this.unitAt(x, y) !== null;
                }
                army(zoneColor) {
                    for (let army of this.armies) {
                        if (army.zoneColor === zoneColor) {
                            return army;
                        }
                    }
                    throw new Error(`No army of Zone: ${Game.ZoneColor[zoneColor]}`);
                }
                exaustedGroups(zoneColor) {
                    let groups = new Array();
                    let army = this.army(zoneColor);
                    for (let group of army.groups) {
                        if (group.exausted) {
                            groups.push(group);
                        }
                    }
                    return groups;
                }
                get activeZone() {
                    let roundInitiative = this.round % this.armies.length;
                    return Game.ZoneColor.RED;
                }
                los(from, to) {
                    return this.losService.los(from, to);
                }
                distance(from, to) {
                    // TODO: implement:
                    return 20;
                }
            }
            Engine.GameState = GameState;
        })(Engine = Game.Engine || (Game.Engine = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Engine;
        (function (Engine) {
            Engine.SUCCESS = { success: true };
            function failure(reason) {
                return {
                    success: false,
                    message: reason
                };
            }
            Engine.failure = failure;
        })(Engine = Game.Engine || (Game.Engine = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Engine;
        (function (Engine) {
            var Util;
            (function (Util) {
                class LosService {
                    constructor(state) {
                        this.state = state;
                    }
                    los(from, to) {
                        for (let x = from.x; x <= from.x + 1; x++) {
                            for (let y = from.y; y <= from.y + 1; y++) {
                                let lines = this.cornerToSpaceLos(x, y, to);
                                if (lines !== null) {
                                    return {
                                        success: true,
                                        lines: lines
                                    };
                                }
                            }
                        }
                        return Engine.failure("No los found");
                    }
                    cornerToSpaceLos(x1, y1, to) {
                        let lines = null;
                        for (let x2 = to.x; x2 <= to.x + 1; x2++) {
                            for (let y2 = to.y; y2 <= to.y + 1; y2++) {
                                let line = this.cornerToCornerLos(x1, y1, x2, y2);
                                if (line !== null) {
                                    if (lines === null) {
                                        lines = new Array();
                                    }
                                    lines.push(line);
                                }
                            }
                        }
                        return lines !== null && lines.length > 1 ? lines : null;
                    }
                    cornerToCornerLos(x1, y1, x2, y2) {
                        // TODO: implement
                        return {
                            fromX: x1,
                            fromY: y1,
                            toX: x2,
                            toY: y2
                        };
                    }
                }
                Util.LosService = LosService;
            })(Util = Engine.Util || (Engine.Util = {}));
        })(Engine = Game.Engine || (Game.Engine = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Engine;
        (function (Engine) {
            var Util;
            (function (Util) {
                var Orientation;
                (function (Orientation) {
                    Orientation[Orientation["TOP_RIGHT"] = 0] = "TOP_RIGHT";
                    Orientation[Orientation["TOP"] = 1] = "TOP";
                    Orientation[Orientation["TOP_LEFT"] = 2] = "TOP_LEFT";
                    Orientation[Orientation["LEFT"] = 3] = "LEFT";
                    Orientation[Orientation["BOTTOM_LEFT"] = 4] = "BOTTOM_LEFT";
                    Orientation[Orientation["BOTTOM"] = 5] = "BOTTOM";
                    Orientation[Orientation["BOTTOM_RIGHT"] = 6] = "BOTTOM_RIGHT";
                    Orientation[Orientation["RIGHT"] = 7] = "RIGHT";
                    Orientation[Orientation["CENTER"] = 8] = "CENTER";
                })(Orientation || (Orientation = {}));
                function orientation(x1, y1, x2, y2) {
                    if (y1 > y2) {
                        if (x1 > x2) {
                            return Orientation.TOP_LEFT;
                        }
                        else if (x1 < x2) {
                            return Orientation.TOP_RIGHT;
                        }
                        else {
                            return Orientation.TOP;
                        }
                    }
                    else if (y1 < y2) {
                        if (x1 > x2) {
                            return Orientation.BOTTOM_LEFT;
                        }
                        else if (x1 < x2) {
                            return Orientation.BOTTOM_RIGHT;
                        }
                        else {
                            return Orientation.BOTTOM;
                        }
                    }
                    else {
                        if (x1 > x2) {
                            return Orientation.LEFT;
                        }
                        else if (x1 < x2) {
                            return Orientation.RIGHT;
                        }
                        else {
                            return Orientation.CENTER;
                        }
                    }
                }
                function obstructed(border) {
                    return border === Game.Border.BLOCKING ||
                        border === Game.Border.IMPASSABLE ||
                        border === Game.Border.WALL;
                }
                function findSpace(x, y, spaces) {
                    for (let space of spaces) {
                        if (space.x === x && space.y === y) {
                            return space;
                        }
                    }
                    return null;
                }
                Util.findSpace = findSpace;
                function accessible(x1, y1, x2, y2, spaces) {
                    let s1 = findSpace(x1, y1, spaces);
                    let s2 = findSpace(x2, y2, spaces);
                    if (s1 === null || s2 === null) {
                        return false;
                    }
                    let upRoute;
                    let downRoute;
                    let leftRoute;
                    let rightRoute;
                    switch (orientation(x1, y1, x2, y2)) {
                        case Orientation.TOP_RIGHT:
                            upRoute = !obstructed(s1.top) && !obstructed(s2.left);
                            rightRoute = !obstructed(s1.right) && !obstructed(s2.bottom);
                            return upRoute || rightRoute;
                        case Orientation.TOP:
                            return !obstructed(s1.top);
                        case Orientation.TOP_LEFT:
                            upRoute = !obstructed(s1.top) && !obstructed(s2.right);
                            leftRoute = !obstructed(s1.left) && !obstructed(s2.bottom);
                            return upRoute || leftRoute;
                        case Orientation.LEFT:
                            return !obstructed(s1.left);
                        case Orientation.BOTTOM_LEFT:
                            downRoute = !obstructed(s1.bottom) && !obstructed(s2.right);
                            leftRoute = !obstructed(s1.left) && !obstructed(s2.top);
                            return downRoute || leftRoute;
                        case Orientation.BOTTOM:
                            return !obstructed(s1.bottom);
                        case Orientation.BOTTOM_RIGHT:
                            downRoute = !obstructed(s1.bottom) && !obstructed(s2.left);
                            rightRoute = !obstructed(s1.right) && !obstructed(s2.top);
                            return downRoute || rightRoute;
                        case Orientation.RIGHT:
                            return !obstructed(s1.right);
                        case Orientation.CENTER:
                            return true;
                    }
                }
                Util.accessible = accessible;
            })(Util = Engine.Util || (Engine.Util = {}));
        })(Engine = Game.Engine || (Game.Engine = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        class Group {
            constructor(id, zoneColor) {
                this.units = new Array();
                this.id = id;
                this.zoneColor = zoneColor;
                this.uniqueId = `${Game.ZoneColor[zoneColor]}.${id}`;
            }
            get state() {
                let state = this.units[0].state;
                for (let i = 1; i < this.units.length; i++) {
                    if (state !== this.units[i].state) {
                        // Mix of ready, active, and exausted
                        return Game.ActivationState.ACTIVE;
                    }
                }
                return state;
            }
            activate(firstUnitId) {
                for (let unit of this.units) {
                    unit.state = unit.id === firstUnitId ?
                        Game.ActivationState.ACTIVE : Game.ActivationState.ACTIVE_WAITING;
                }
            }
            ready() {
                for (let unit of this.units) {
                    unit.state = Game.ActivationState.READY;
                }
            }
            getUnit(id) {
                for (let unit of this.units) {
                    if (unit.id === id) {
                        return unit;
                    }
                }
                throw new Error('No unit with id: ${id}');
            }
            get exausted() {
                return this.state === Game.ActivationState.EXAUSTED;
            }
            get active() {
                return this.state === Game.ActivationState.ACTIVE;
            }
            get activeUnit() {
                for (let unit of this.units) {
                    if (unit.active) {
                        return unit;
                    }
                }
                return null;
            }
        }
        Game.Group = Group;
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        class Line {
            constructor(x1, y1, x2, y2) {
                this.x1 = x1;
                this.y1 = y1;
                this.x2 = x2;
                this.y2 = y2;
                this.xMin = x1 < x2 ? x1 : x2;
                this.yMin = y1 < y2 ? y1 : y2;
                this.xMax = x1 > x2 ? x1 : x2;
                this.yMax = y1 > y2 ? y1 : y2;
                // Produces Infinity for vertical lines
                this.m = (y2 - y1) / (x2 - x1);
                if (this.m === -Infinity) {
                    this.m = Infinity;
                }
                // y = mx + b
                // y - mx = b
                this.b = y1 - (this.m * x1);
                if (this.b === -Infinity) {
                    this.b = Infinity;
                }
            }
            interects(line) {
                if (this.m === line.m) {
                    // Intersects infinitely or not at all
                    return this.b === line.b;
                }
                if (this.m === Infinity) {
                    // This line is vertical, x1 and x2 are the same
                    let x = this.x1;
                    let y = line.yGivenX(x);
                    return this.inBounds(x, y);
                }
                if (line.m === Infinity) {
                    let x = line.x1;
                    let y = this.yGivenX(x);
                    return this.inBounds(x, y);
                }
                // Different slopes
                // y = mx + b
                // m1x + b1 = m2x + b2
                // m1x = m2x + b2 - b1
                // m1x - m2x = b2 - b1
                // x(m1 - m2) = b2 - b1
                // x = (b2 - b1) / (m1 - m2)
                let x = (line.b - this.b) / (line.m - this.m);
                let y = this.yGivenX(x);
                return this.inBounds(x, y);
            }
            inBounds(x, y) {
                return this.xMin < x && x < this.xMax && this.yMin < y && y < this.yMax;
            }
            yGivenX(x) {
                // y = mx + b
                return (this.m * x) + this.b;
            }
            xGivenY(y) {
                // y = mx + b
                // y - b  = mx
                // (y - b) / m  = x
                return (y - this.b) / this.m;
            }
        }
        Game.Line = Line;
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        class Modifier {
            constructor(data) {
                this.type = Game.Attribute.parse(data.type);
                this.status = data.status === undefined ? null : Game.StatusEffect.parse(data.status);
                this.value = data.value || null;
                this.description = this.createDescription();
            }
            createDescription() {
                let description = "";
                if (this.status !== null) {
                    description += `${Game.StatusEffect[this.status]}`;
                }
                if (this.value !== null) {
                    description += `${this.value < 0 ? "" : "+"}${this.value} `;
                }
                description += `:${Game.Attribute[this.type]}:`;
                return description;
            }
            toString() {
                return this.description;
            }
        }
        Game.Modifier = Modifier;
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        class Skirmish {
            constructor(id, config, tiles) {
                this.id = id;
                this.spaces = new Array();
                this.deploymentZones = config.deployment_zones;
                let tileTable = this.createTileTable(tiles);
                for (let tileInfo of config.tiles) {
                    let tile = tileTable[tileInfo.tile_id];
                    this.addSpaces(tileInfo.x, tileInfo.y, tileInfo.rotation || 0, tile);
                }
            }
            createTileTable(tiles) {
                let table = {};
                for (let tile of tiles) {
                    table[tile.id] = tile;
                }
                return table;
            }
            addSpaces(offsetX, offsetY, rotation, tile) {
                let maxX = this.getMax(tile, "x");
                let maxY = this.getMax(tile, "y");
                let x;
                let y;
                let left;
                let top;
                let bottom;
                let right;
                for (let space of tile.spaces) {
                    switch (rotation) {
                        case 0:
                            x = offsetX + space.x;
                            y = offsetY + space.y;
                            top = space.top;
                            left = space.left;
                            bottom = space.bottom;
                            right = space.right;
                            break;
                        case 90:
                            x = offsetX + maxY - space.y;
                            y = offsetY + space.x;
                            top = space.left;
                            left = space.bottom;
                            bottom = space.right;
                            right = space.top;
                            break;
                        case 180:
                            x = offsetX + maxX - space.x;
                            y = offsetY + maxY - space.y;
                            top = space.bottom;
                            left = space.right;
                            bottom = space.top;
                            right = space.left;
                            break;
                        case 270:
                            x = offsetX + space.y;
                            y = offsetY + maxX - space.x;
                            top = space.right;
                            left = space.top;
                            bottom = space.left;
                            right = space.bottom;
                            break;
                        default:
                            throw new Error("Unsupported rotation:" + rotation);
                    }
                    let dZoneColor = this.getDeploymentZoneColor(x, y);
                    let mapSpace = new Game.Space(x, y, top, left, bottom, right, rotation, tile.terrain, dZoneColor);
                    this.spaces.push(mapSpace);
                }
            }
            getDeploymentZoneColor(x, y) {
                for (let zone of this.deploymentZones) {
                    for (let space of zone.spaces) {
                        if (space.x === x && space.y === y) {
                            return zone.color;
                        }
                    }
                }
                return null;
            }
            getMax(tile, attribute) {
                var max = 0;
                for (let space of tile.spaces) {
                    if (space[attribute] > max) {
                        max = space[attribute];
                    }
                }
                return max;
            }
        }
        Game.Skirmish = Skirmish;
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var Border;
        (function (Border) {
            Border[Border["NONE"] = 0] = "NONE";
            Border[Border["WALL"] = 1] = "WALL";
            Border[Border["BLOCKING"] = 2] = "BLOCKING";
            Border[Border["DIFFICULT"] = 3] = "DIFFICULT";
            Border[Border["IMPASSABLE"] = 4] = "IMPASSABLE";
        })(Border = Game.Border || (Game.Border = {}));
        class BorderLines {
            constructor(x, y) {
                this.top = new Game.Line(x, y, x + 1, y);
                this.left = new Game.Line(x, y, x, y + 1);
                this.bottom = new Game.Line(x, y + 1, x + 1, y + 1);
                this.right = new Game.Line(x + 1, y, x + 1, y + 1);
            }
        }
        Game.BorderLines = BorderLines;
        class Space {
            constructor(x, y, topBorder, leftBorder, bottomBorder, rightBorder, rotation, terrain, deploymentZoneColor) {
                this.x = x;
                this.y = y;
                this.lines = new BorderLines(x, y);
                this.terrain = terrain;
                this.top = this.toBorder(topBorder);
                this.left = this.toBorder(leftBorder);
                this.bottom = this.toBorder(bottomBorder);
                this.right = this.toBorder(rightBorder);
                this.rotation = rotation;
                this.deploymentZoneColor = deploymentZoneColor;
            }
            toBorder(value) {
                if (!value) {
                    return Border.NONE;
                }
                switch (value) {
                    case "wall":
                        return Border.WALL;
                    case "blocking_terrain":
                        return Border.BLOCKING;
                    case "difficult_terrain":
                        return Border.DIFFICULT;
                    case "impassable_terrain":
                        return Border.IMPASSABLE;
                }
                throw new Error(`Unknown border; ${value}`);
            }
        }
        Game.Space = Space;
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var StatusEffect;
        (function (StatusEffect) {
            StatusEffect[StatusEffect["STUN"] = 0] = "STUN";
            StatusEffect[StatusEffect["BLEED"] = 1] = "BLEED";
            StatusEffect[StatusEffect["WEAKENED"] = 2] = "WEAKENED";
            StatusEffect[StatusEffect["FOCUSED"] = 3] = "FOCUSED";
            StatusEffect[StatusEffect["HIDDEN"] = 4] = "HIDDEN";
        })(StatusEffect = Game.StatusEffect || (Game.StatusEffect = {}));
        (function (StatusEffect) {
            function parse(name) {
                let attr = StatusEffect[name.toUpperCase()];
                if (attr !== undefined) {
                    return attr;
                }
                throw new Error(`Unknown StatusEffect: ${name}`);
            }
            StatusEffect.parse = parse;
        })(StatusEffect = Game.StatusEffect || (Game.StatusEffect = {}));
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        // TODO: ids
        class Surge {
            constructor(id, data) {
                this.id = id;
                this.cost = data.cost;
                this.modifiers = new Array();
                for (let modifier of data.modifiers) {
                    this.modifiers.push(new Game.Modifier(modifier));
                }
                this.description = this.createDescription();
            }
            createDescription() {
                let description = "";
                for (let i = 0; i < this.cost; i++) {
                    description += ":surge:";
                }
                description += ": " + this.modifiers.join(", ");
                return description;
            }
            toString() {
                return this.description;
            }
        }
        Game.Surge = Surge;
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        class Unit {
            // TODO; public health: number;
            constructor(id, groupId, zoneColor, deployment) {
                this.id = id;
                this.groupId = groupId;
                this.uniqueId = `${Game.ZoneColor[zoneColor]}.${deployment.id}.${groupId}.${id}`.toLowerCase();
                this.deployment = deployment;
                this.x = 0;
                this.y = 0;
                this.zoneColor = zoneColor;
                this._state = Game.ActivationState.READY;
                this.movementPoints = 0;
                this.health = deployment.health;
                this.abilities = deployment.abilities;
                this.actions = new Array();
                this.actionCount = 0;
                for (let ability of deployment.abilities) {
                    if (ability.isAction || ability.isSpecialAction) {
                        this.actions.push(ability);
                    }
                }
                window.units = window.units || {};
                window.units[this.uniqueId] = this;
            }
            get state() {
                return this._state;
            }
            set state(value) {
                this._state = value;
                switch (value) {
                    case Game.ActivationState.ACTIVE:
                        this.actionCount = 2;
                        break;
                    case Game.ActivationState.EXAUSTED:
                        this.actionCount = 0;
                        break;
                }
            }
            get ready() {
                return this._state === Game.ActivationState.READY;
            }
            get exausted() {
                return this._state === Game.ActivationState.EXAUSTED;
            }
            get active() {
                return this._state === Game.ActivationState.ACTIVE;
            }
            get activeWaiting() {
                return this._state === Game.ActivationState.ACTIVE_WAITING;
            }
        }
        Unit.CLASS_ELITE = "elite";
        Unit.CLASS_REGULAR = "regular";
        Game.Unit = Unit;
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Game;
    (function (Game) {
        var ZoneColor;
        (function (ZoneColor) {
            ZoneColor[ZoneColor["RED"] = 0] = "RED";
            ZoneColor[ZoneColor["BLUE"] = 1] = "BLUE";
        })(ZoneColor = Game.ZoneColor || (Game.ZoneColor = {}));
        function toZoneColor(color) {
            let zoneColor = ZoneColor[color.toUpperCase()];
            if (zoneColor === undefined) {
                throw new Error(`Invalid Zone Color: ${color}`);
            }
            return zoneColor;
        }
        Game.toZoneColor = toZoneColor;
    })(Game = App.Game || (App.Game = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Model;
    (function (Model) {
        function createArmy(title, deploymentIds, armyCollection) {
            let newArmy = {
                "id": armyCollection.__last_id__++,
                "title": title,
                "deploymentIds": deploymentIds
            };
            armyCollection.armies.push(newArmy);
            return newArmy;
        }
        Model.createArmy = createArmy;
        function createArmyCollection() {
            return {
                "__last_id__": 1,
                "armies": []
            };
        }
        Model.createArmyCollection = createArmyCollection;
    })(Model = App.Model || (App.Model = {}));
})(App || (App = {}));
"use strict";
"use strict";
"use strict";
"use strict";
"use strict";
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        Ng.module = angular.module("app", ["ngRoute"]);
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
/// <reference path="../modules/App.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        /**
         * Receives UI Events and interprets them into Game Actions.
         * Renders game state.
         *
         *
         */
        class AttackController {
            constructor($scope) {
                this.$scope = $scope;
                this.$scope.$on(AttackController.EVENT_ATTACK_BEGIN, this.onAttackBegin.bind(this));
                this.$scope.complete = this.complete.bind(this);
                this.$scope.spendSurge = this.spendSurge.bind(this);
                this.$scope.rerollAttackDie = this.rerollAttackDie.bind(this);
                this.$scope.rerollDefenseDie = this.rerollDefenseDie.bind(this);
                App.debug[AttackController.NAME] = this;
            }
            onAttackBegin(event, ctx) {
                this.$scope.ctx = ctx;
            }
            rerollAttackDie(roll) {
                //(this.$scope.attackCtx!).reroll(roll.id);
                roll.side = roll.die.roll();
            }
            rerollDefenseDie(roll) {
                roll.side = roll.die.roll();
                //(this.$scope.attackCtx!).reroll(roll.id);
            }
            spendSurge(surge) {
                if (this.$scope.ctx === null) {
                    throw new Error('No current attack');
                }
                this.$scope.ctx.spendSurge(surge);
            }
            complete() {
                this.$scope.$emit(AttackController.EVENT_ATTACK_COMPLETE);
            }
        }
        AttackController.NAME = "attackController";
        AttackController.EVENT_ATTACK_BEGIN = "attack_begin";
        AttackController.EVENT_ATTACK_COMPLETE = "attack_complete";
        Ng.AttackController = AttackController;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.controller(App.Ng.AttackController.NAME, [
    '$scope',
    App.Ng.AttackController
]);
App.Ng.module.component('attack', {
    templateUrl: 'assets/html/component/attack.html',
    controller: App.Ng.AttackController.NAME
});
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        var SkirmishPlayer;
        (function (SkirmishPlayer) {
            /**
             * Container for holding source data and rendering info.
             *
             */
            class UiSpace {
                constructor(space) {
                    this.space = space;
                    this.neighbors = new Array();
                    this._points = null;
                }
                populateNeighbors(spaces, uiSpaces) {
                    let x1 = this.space.x;
                    let y1 = this.space.y;
                    for (let y2 = y1 - 1; y2 <= y1 + 1; y2++) {
                        for (let x2 = x1 - 1; x2 <= x1 + 1; x2++) {
                            if (y2 === y1 && x2 === x1) {
                                continue;
                            }
                            if (App.Game.Engine.Util.accessible(x1, y1, x2, y2, spaces)) {
                                this.neighbors.push(SkirmishPlayer.UiUtils.findSpace(x2, y2, uiSpaces));
                            }
                        }
                    }
                }
                /**
                 * Movement points remaining after entering this space
                 *
                 */
                get points() {
                    return this._points;
                }
                set points(value) {
                    if (value === null) {
                        this._points = null;
                        return;
                    }
                    this._points = value;
                    let nValue = value - 1;
                    if (nValue < 0) {
                        return;
                    }
                    for (let neighbor of this.neighbors) {
                        if (neighbor.points === null || neighbor.points < nValue) {
                            neighbor.points = nValue;
                        }
                    }
                }
            }
            SkirmishPlayer.UiSpace = UiSpace;
        })(SkirmishPlayer = Ng.SkirmishPlayer || (Ng.SkirmishPlayer = {}));
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        var SkirmishPlayer;
        (function (SkirmishPlayer) {
            var UiUtils;
            (function (UiUtils) {
                function findSpace(x, y, uiSpaces) {
                    for (let uiSpace of uiSpaces) {
                        if (uiSpace.space.x === x && uiSpace.space.y === y) {
                            return uiSpace;
                        }
                    }
                    return null;
                }
                UiUtils.findSpace = findSpace;
            })(UiUtils = SkirmishPlayer.UiUtils || (SkirmishPlayer.UiUtils = {}));
        })(SkirmishPlayer = Ng.SkirmishPlayer || (Ng.SkirmishPlayer = {}));
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
/// <reference path="../modules/App.ts"/>
/// <reference path="../../game/Skirmish.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class ComponentLoader {
            constructor($http, id, listener) {
                this.id = id;
                this.$http = $http;
                this.listener = listener;
                this.tiles = [];
            }
            load() {
                let self = this;
                if (!this.config) {
                    let req = this.createConfigRequest();
                    this.$http(req).then(function (res) {
                        self.config = res.data;
                        self.load();
                    });
                    return;
                }
                for (let mapTile of this.config.tiles) {
                    let req = this.createTileRequest(mapTile.tile_id);
                    this.$http(req).then(function (res) {
                        let tile = res.data;
                        tile.id = mapTile.tile_id;
                        self.tiles.push(tile);
                        self.checkState();
                    });
                }
            }
            checkState() {
                if (this.config.tiles.length !== this.tiles.length) {
                    return;
                }
                let skirmish = new App.Game.Skirmish(this.id, this.config, this.tiles);
                this.listener.onSkirmishLoad(skirmish);
            }
            createConfigRequest() {
                return {
                    url: `assets/json/skirmish/${this.id}.json`,
                    method: 'GET',
                    cache: true
                };
            }
            createTileRequest(id) {
                return {
                    url: `assets/json/tile/${id}.json`,
                    method: 'GET',
                    cache: true
                };
            }
        }
        class SkirmishLoader {
            constructor($http) {
                this.$http = $http;
            }
            load(id, listener) {
                let loader = new ComponentLoader(this.$http, id, listener);
                loader.load();
            }
        }
        SkirmishLoader.NAME = "skirmishLoader";
        Ng.SkirmishLoader = SkirmishLoader;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.factory(App.Ng.SkirmishLoader.NAME, [
    '$http',
    function ($http) {
        return new App.Ng.SkirmishLoader($http);
    }
]);
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class AbilityLoader {
            constructor() {
                this.loadRequestListener = null;
            }
            load(id) {
                if (this.loadRequestListener === null) {
                    throw new Error('loadRequestListener not set');
                }
                return this.loadRequestListener.requestScript(`/assets/js/ability/${id}.js`);
            }
        }
        AbilityLoader.NAME = "abilityLoader";
        Ng.AbilityLoader = AbilityLoader;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.factory(App.Ng.AbilityLoader.NAME, [
    function () {
        return new App.Ng.AbilityLoader();
    }
]);
/// <reference path="AbilityLoader.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class ComponentLoader {
            constructor($http, abilityLoader, id, listener) {
                this.$http = $http;
                this.id = id;
                this.listener = listener;
                this.image = new Image();
                this.abilities = [];
                this.isImageLoaded = false;
                this.abilityLoader = abilityLoader;
            }
            load() {
                let self = this;
                if (!this.deployment) {
                    let req = this.createDataRequest();
                    this.$http(req).then(function (res) {
                        self.deployment = res.data;
                        self.load();
                    });
                    return;
                }
                for (let id of this.deployment.abilities) {
                    App.Game.Ability.ability(id, this);
                    this.abilityLoader.load(id);
                }
                this.image.onload = function () {
                    self.isImageLoaded = true;
                    self.checkState();
                };
                this.image.src = this.deployment.image_url;
            }
            onAbilityLoad(ability) {
                this.abilities.push(ability);
                this.checkState();
            }
            checkState() {
                if (!this.isImageLoaded) {
                    return;
                }
                if (this.abilities.length !== this.deployment.abilities.length) {
                    return;
                }
                this.listener.onDeploymentLoaded(new App.Game.Deployment(this.id, this.image, this.deployment, this.abilities));
            }
            createDataRequest() {
                return {
                    url: `assets/json/deployment/${this.id}.json`,
                    method: 'GET',
                    cache: true
                };
            }
        }
        class DeploymentLoader {
            constructor($http, abilityLoader) {
                this.$http = $http;
                this.abilityLoader = abilityLoader;
            }
            load(id, listener) {
                let loader = new ComponentLoader(this.$http, this.abilityLoader, id, listener);
                loader.load();
            }
        }
        DeploymentLoader.NAME = "deplymentLoader";
        Ng.DeploymentLoader = DeploymentLoader;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.factory(App.Ng.DeploymentLoader.NAME, [
    '$http',
    App.Ng.AbilityLoader.NAME,
    function ($http, abilityLoader) {
        return new App.Ng.DeploymentLoader($http, abilityLoader);
    }
]);
/// <reference path="../modules/App.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        /**
         * Managers army persistances
         *
         */
        class ArmyCache {
            constructor() {
                if (ArmyCache.LS_KEY in localStorage) {
                    this.armyCollection = JSON.parse(localStorage[ArmyCache.LS_KEY]);
                    return;
                }
                this.armyCollection = App.Model.createArmyCollection();
            }
            get armies() {
                return this.armyCollection.armies;
            }
            load(id) {
                for (var i = 0; i < this.armies.length; i++) {
                    if (this.armies[i].id === id) {
                        return this.armies[i];
                    }
                }
                throw new Error(`Unable to find army with id, ${id}; not found.`);
            }
            removeArmy(id) {
                var index = -1;
                for (var i = 0; i < this.armies.length; i++) {
                    if (this.armies[i].id === id) {
                        index = i;
                        break;
                    }
                }
                if (index === -1) {
                    throw new Error(`Unable to delete army with id, ${id}; not found.`);
                }
                this.armyCollection.armies.splice(index, 1);
                this.persistCache();
            }
            saveArmy(title, deploymentIds) {
                App.Model.createArmy(title, deploymentIds, this.armyCollection);
                this.persistCache();
            }
            persistCache() {
                localStorage[ArmyCache.LS_KEY] = JSON.stringify(this.armyCollection);
            }
        }
        ArmyCache.NAME = "armyCache";
        ArmyCache.LS_KEY = "armies";
        Ng.ArmyCache = ArmyCache;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.factory(App.Ng.ArmyCache.NAME, [
    function () {
        return new App.Ng.ArmyCache();
    }
]);
/// <reference path="DeploymentLoader.ts"/>
/// <reference path="ArmyCache.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class ComponentLoader {
            constructor($http, deploymentLoader, id, zoneColor, army, listener) {
                this.$http = $http;
                this.deploymentLoader = deploymentLoader;
                this.id = id;
                this.title = army.title;
                this.zoneColor = zoneColor;
                this.army = army;
                this.listener = listener;
                this.deployments = [];
            }
            load() {
                for (let id of this.army.deploymentIds) {
                    this.deploymentLoader.load(id, this);
                }
            }
            onDeploymentLoaded(deployment) {
                this.deployments.push(deployment);
                if (this.deployments.length === this.army.deploymentIds.length) {
                    let army = new App.Game.Army(this.id, this.title, this.zoneColor, this.deployments);
                    this.listener.onArmyLoad(army);
                }
            }
        }
        class ArmyLoader {
            constructor($http, armyCache, deploymentLoader) {
                this.$http = $http;
                this.armyCache = armyCache;
                this.deploymentLoader = deploymentLoader;
            }
            load(id, zoneColor, listener) {
                let army = this.armyCache.load(id);
                let loader = new ComponentLoader(this.$http, this.deploymentLoader, id, zoneColor, army, listener);
                loader.load();
            }
        }
        ArmyLoader.NAME = "armyLoader";
        Ng.ArmyLoader = ArmyLoader;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.factory(App.Ng.ArmyLoader.NAME, [
    '$http',
    App.Ng.ArmyCache.NAME,
    App.Ng.DeploymentLoader.NAME,
    function ($http, armyCache, deploymentLoader) {
        return new App.Ng.ArmyLoader($http, armyCache, deploymentLoader);
    }
]);
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class StateCache {
            constructor() {
                if (StateCache.LS_KEY in localStorage) {
                    this.stateCollection = JSON.parse(localStorage[StateCache.LS_KEY]);
                }
                else {
                    this.stateCollection = {
                        __last_id__: 1,
                        states: []
                    };
                }
                this.states = this.stateCollection.states;
            }
            save(gameState) {
                let unitStates = new Array();
                let state = {
                    id: this.stateCollection.__last_id__++,
                    skirmish_id: gameState.skirmish.id,
                    units: unitStates,
                    round: gameState.round,
                    initiative: App.Game.ZoneColor[gameState.initiative],
                    timestamp: Date.now()
                };
                for (let army of gameState.armies) {
                    switch (army.zoneColor) {
                        case App.Game.ZoneColor.RED:
                            state["red"] = army.id;
                            break;
                        case App.Game.ZoneColor.BLUE:
                            state["blue"] = army.id;
                            break;
                        default:
                            throw new Error(`Unknown zone color: ${army.zoneColor}`);
                    }
                    for (let unit of army.units) {
                        unitStates.push(this.createUnitState(unit));
                    }
                }
                this.stateCollection.states.push(state);
                this.persistCache();
            }
            load(stateId, gameState) {
                let state = this.getState(stateId);
                for (let unitState of state.units) {
                    let unit = gameState.unit(unitState.unique_id);
                    unit.movementPoints = unitState.movement_points;
                    unit.state = App.Game.ActivationState[unitState.state];
                    unit.x = unitState.x;
                    unit.y = unitState.y;
                }
            }
            getState(id) {
                for (let state of this.states) {
                    if (state.id === id) {
                        return state;
                    }
                }
                throw new Error(`No state with id: ${id}`);
            }
            createUnitState(unit) {
                return {
                    unique_id: unit.uniqueId,
                    movement_points: unit.movementPoints,
                    x: unit.x,
                    y: unit.y,
                    state: App.Game.ActivationState[unit.state]
                };
            }
            persistCache() {
                localStorage[StateCache.LS_KEY] = JSON.stringify(this.stateCollection);
            }
        }
        StateCache.NAME = "stateCache";
        StateCache.LS_KEY = "game_state";
        Ng.StateCache = StateCache;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.factory(App.Ng.StateCache.NAME, [
    function () {
        return new App.Ng.StateCache();
    }
]);
/// <reference path="SkirmishLoader.ts"/>
/// <reference path="ArmyLoader.ts"/>
/// <reference path="StateCache.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class ComponentLoader {
            constructor(initiative, stateId, stateCache, listener) {
                this.stateCache = stateCache;
                this.initiative = initiative;
                this.armies = new Array();
                this.stateId = stateId;
                this.listener = listener;
            }
            onSkirmishLoad(skirmish) {
                this.skirmish = skirmish;
                this.check();
            }
            onArmyLoad(army) {
                this.armies.push(army);
                this.check();
            }
            check() {
                if (!this.skirmish ||
                    this.skirmish.deploymentZones.length !== this.armies.length) {
                    // Either skirmish not loaded, or all armies are not loaded
                    return;
                }
                let gameState = new App.Game.Engine.GameState(this.skirmish, this.armies, this.initiative);
                let engine = new App.Game.Engine.GameEngine(gameState);
                if (this.stateId !== null) {
                    this.stateCache.load(this.stateId, gameState);
                }
                this.listener.onGameEngineReady(engine);
            }
        }
        class EngineLoader {
            constructor(skirmishLoader, armyLoader, stateCache) {
                this.skirmishLoader = skirmishLoader;
                this.armyLoader = armyLoader;
                this.stateCache = stateCache;
            }
            load(skirmishId, blueId, redId, initiative, stateId, listener) {
                let loader = new ComponentLoader(initiative, stateId, this.stateCache, listener);
                this.skirmishLoader.load(skirmishId, loader);
                this.armyLoader.load(blueId, App.Game.ZoneColor.BLUE, loader);
                this.armyLoader.load(redId, App.Game.ZoneColor.RED, loader);
            }
        }
        EngineLoader.NAME = "engineLoader";
        Ng.EngineLoader = EngineLoader;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.factory(App.Ng.EngineLoader.NAME, [
    App.Ng.SkirmishLoader.NAME,
    App.Ng.ArmyLoader.NAME,
    App.Ng.StateCache.NAME,
    function (skirmishLoader, armyLoader, stateCache) {
        return new App.Ng.EngineLoader(skirmishLoader, armyLoader, stateCache);
    }
]);
/// <reference path="../modules/App.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        const DEFAULT_SIZE = 40;
        const DEFAULT_MARGIN = 32;
        const DEFAULT_DEPLOYMENT_MARGIN = 4;
        class RenderingContext {
            constructor() {
                this.deploymentMargin = DEFAULT_DEPLOYMENT_MARGIN;
                this.margin = DEFAULT_MARGIN;
                this.size = DEFAULT_SIZE;
            }
            get selectedSize() {
                return this._selectedSize;
            }
            get size() {
                return this._size;
            }
            set size(value) {
                this._size = value;
                this._radius = value / 2;
                this._selectedSize = value * 1.1;
            }
            get radius() {
                return this._radius;
            }
            left(x) {
                return this.margin + (this._size * x);
            }
            top(y) {
                return this.margin + (this._size * y);
            }
            right(x) {
                return this.margin + (this._size * (x + 1));
            }
            bottom(y) {
                return this.margin + (this._size * (y + 1));
            }
        }
        RenderingContext.NAME = "renderContext";
        Ng.RenderingContext = RenderingContext;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.factory(App.Ng.RenderingContext.NAME, [
    function () {
        return new App.Ng.RenderingContext();
    }
]);
/// <reference path="../modules/App.ts"/>
/// <reference path="../services/EngineLoader.ts"/>
/// <reference path="../services/RenderingContext.ts"/>
/// <reference path="../services/StateCache.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        /**
         * Receives UI Events and interprets them into Game Actions.
         * Renders game state.
         *
         *
         */
        class SkirmishPlayerController {
            constructor($scope, $routeParams, $timeout, engineLoader, renderCtx, stateCache) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.renderCtx = renderCtx;
                this.stateCache = stateCache;
                engineLoader.load($routeParams.skirmish_id, parseInt($routeParams.blue), parseInt($routeParams.red), App.Game.toZoneColor($routeParams.initiative), ($routeParams.state ? parseInt($routeParams.state) : null), this);
                this.stateCache = stateCache;
                this.$timeout = $timeout;
                this.$scope = $scope;
                this.$scope.rCtx = this.renderCtx;
                this.$scope.units = new Array();
                this.$scope.targetableUnits = new Array();
                this.$scope.spaces = new Array();
                this.$scope.attackMenuVisible = this.attackMenuVisible.bind(this);
                this.$scope.selectUnit = this.selectUnit.bind(this);
                this.$scope.exaust = this.exaust.bind(this);
                this.$scope.attack = this.attack.bind(this);
                this.$scope.cancelAttack = this.cancelAttack.bind(this);
                this.$scope.move = this.move.bind(this);
                this.$scope.selectSpace = this.selectSpace.bind(this);
                this.$scope.$on(Ng.SkirmishController.EVENT_SAVE_STATE, this.saveState.bind(this));
                this.$scope.$on(Ng.AttackController.EVENT_ATTACK_COMPLETE, this.onAttackComplete.bind(this));
                this.$scope.attackCtx = null;
                this.$scope.isTargetable = this.isTargetable.bind(this);
                App.debug["skirmishPlayerScope"] = $scope;
            }
            onGameEngineReady(engine) {
                this.engine = engine;
                this.$scope.state = engine.state;
                for (let gameSpace of this.engine.state.skirmish.spaces) {
                    this.$scope.spaces.push(new Ng.SkirmishPlayer.UiSpace(gameSpace));
                }
                for (let space of this.$scope.spaces) {
                    space.populateNeighbors(engine.state.skirmish.spaces, this.$scope.spaces);
                }
                for (let army of this.engine.state.armies) {
                    this.$scope.units = this.$scope.units.concat(army.units);
                }
                this.updateMovementPoints();
                // Refresh view state
                this.$timeout(angular.noop);
            }
            onAttackComplete(name, ...args) {
                this.$scope.attackCtx = null;
            }
            exaust(unit) {
                let result = this.engine.exaust(unit);
                if (result.success) {
                    this.updateMovementPoints();
                }
                else {
                    console.log(result);
                }
            }
            cancelAttack() {
                this.$scope.attackCtx = null;
                this.$scope.targetableUnits = new Array();
            }
            attack(unit) {
                if (this.$scope.attackCtx !== null) {
                    console.error("Already performing an attack");
                    return;
                }
                let ctx = this.engine.beginAttack(unit);
                this.$scope.attackCtx = ctx;
                for (let unit of this.$scope.units) {
                    if (ctx.targetable(unit)) {
                        this.$scope.targetableUnits.push(unit);
                    }
                }
                this.$scope.$broadcast(Ng.AttackController.EVENT_ATTACK_BEGIN, ctx);
            }
            isTargetable(unit) {
                for (let targetable of this.$scope.targetableUnits) {
                    if (unit.uniqueId === targetable.uniqueId) {
                        return true;
                    }
                }
                return false;
            }
            move(unit) {
                unit.movementPoints += unit.deployment.speed;
                this.updateMovementPoints();
            }
            saveState() {
                this.stateCache.save(this.engine.state);
            }
            selectUnit(unit) {
                if (this.engine.state.activeUnit === null) {
                    this.activate(unit);
                    return;
                }
                if (this.$scope.attackCtx !== null) {
                    let ctx = this.$scope.attackCtx;
                    if (ctx.target !== null) {
                        console.error(`Already targeting ${ctx.target.uniqueId}`);
                        return;
                    }
                    if (!ctx.targetable(unit)) {
                        console.error(`Cannot target ${unit.uniqueId}`);
                        return;
                    }
                    ctx.target = unit;
                    this.$scope.targetableUnits = new Array();
                    return;
                }
                console.log(`Doing nothing with ${unit.uniqueId}`);
            }
            selectSpace(uiSpace) {
                if (this.$scope.attackCtx !== null) {
                    return;
                }
                if (uiSpace.points === null) {
                    // Nothing to do 
                    return;
                }
                let unit = this.engine.state.activeUnit;
                if (unit === null) {
                    return;
                }
                let result = this.engine.move(unit, this.findPath(unit, uiSpace));
                if (!result.success) {
                    console.error(result.message);
                    return;
                }
                this.updateMovementPoints();
            }
            activate(unit) {
                let result = this.engine.activate(unit);
                if (!result.success) {
                    console.log(result);
                    return;
                }
                this.updateMovementPoints();
            }
            updateMovementPoints() {
                for (let space of this.$scope.spaces) {
                    space.points = null;
                }
                let unit = this.engine.state.activeUnit;
                if (unit === null) {
                    return;
                }
                let space = Ng.SkirmishPlayer.UiUtils.findSpace(unit.x, unit.y, this.$scope.spaces);
                space.points = unit.movementPoints;
            }
            findPath(unit, uiSpace) {
                let path = new Array();
                path.push(uiSpace.space);
                for (let points = uiSpace.points + 1; points < unit.movementPoints; points++) {
                    for (let neighbor of uiSpace.neighbors) {
                        if (neighbor.points === points) {
                            uiSpace = neighbor;
                            path.push(uiSpace.space);
                            break;
                        }
                    }
                }
                return path.reverse();
            }
            attackMenuVisible() {
                return this.$scope.attackCtx !== null &&
                    this.$scope.attackCtx.target !== null;
            }
        }
        SkirmishPlayerController.NAME = "skirmishPlayerController";
        Ng.SkirmishPlayerController = SkirmishPlayerController;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.controller(App.Ng.SkirmishPlayerController.NAME, [
    '$scope',
    '$routeParams',
    '$timeout',
    App.Ng.EngineLoader.NAME,
    App.Ng.RenderingContext.NAME,
    App.Ng.StateCache.NAME,
    App.Ng.SkirmishPlayerController
]);
App.Ng.module.component('skirmishPlayer', {
    templateUrl: 'assets/html/component/skirmish-player.html',
    controller: App.Ng.SkirmishPlayerController.NAME
});
/// <reference path="../modules/App.ts"/>
"use strict";
App.Ng.module
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when(App.Ng.RootController.PATH, {
            templateUrl: `assets/html/routes/${App.Ng.RootController.HTML_NAME}.html`,
            controller: App.Ng.RootController.NAME
        })
            .when(App.Ng.ArmyController.PATH, {
            templateUrl: `assets/html/routes/${App.Ng.ArmyController.HTML_NAME}.html`,
            controller: App.Ng.ArmyController.NAME
        })
            .when(App.Ng.SkirmishController.PATH, {
            templateUrl: `assets/html/routes/${App.Ng.SkirmishController.HTML_NAME}.html`,
            controller: App.Ng.SkirmishController.NAME
        })
            .when(App.Ng.SkirmishSetupController.PATH, {
            templateUrl: `assets/html/routes/${App.Ng.SkirmishSetupController.HTML_NAME}.html`,
            controller: App.Ng.SkirmishSetupController.NAME
        })
            .when(App.Ng.TileBuilderController.PATH, {
            templateUrl: `assets/html/routes/${App.Ng.TileBuilderController.HTML_NAME}.html`,
            controller: App.Ng.TileBuilderController.NAME
        })
            .otherwise({
            redirectTo: '/'
        });
    }]);
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class BaseController {
            constructor($rootScope) {
                // TODO: remove
                window.$rootScope = $rootScope;
                this.$rootScope = $rootScope;
                this.subscriptions = {};
                this.subscribe(BaseController.EVENT_NAV_AWAY, this.unsubcribeAll.bind(this));
            }
            subscribe(eventName, listener) {
                let unsub = this.$rootScope.$on(eventName, listener);
                this.subscriptions[eventName] = unsub;
            }
            unsubcribeAll() {
                for (let key in this.subscriptions) {
                    let unsub = this.subscriptions[key];
                    unsub();
                }
            }
        }
        BaseController.EVENT_NAV_AWAY = "$locationChangeStart";
        Ng.BaseController = BaseController;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
/// <reference path="../modules/App.ts"/>
/// <reference path="../services/ArmyCache.ts"/>
/// <reference path="BaseController.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class ArmyController extends Ng.BaseController {
            constructor($rootScope, $scope, $http, armyCache) {
                super($rootScope);
                this.$scope = $scope;
                this.armyCache = armyCache;
                this.$scope.selectedArmyId = ArmyController.ID_NEW;
                this.$scope.armies = this.armyCache.armies;
                this.$scope.addDeployment = this.addDeployment.bind(this);
                this.$scope.removeDeployment = this.removeDeployment.bind(this);
                this.$scope.saveArmy = this.saveArmy.bind(this);
                this.$scope.selectArmy = this.selectArmy.bind(this);
                this.$scope.removeArmy = this.removeArmy.bind(this);
                $http.get(ArmyController.DEPLOYMENTS_LIST_PATH)
                    .then(this.onListLoaded.bind(this));
            }
            selectArmy() {
                if (ArmyController.ID_NEW === this.$scope.selectedArmyId) {
                    this.$scope.selectedIds = [];
                    return;
                }
                let army = this.getArmy(parseInt(this.$scope.selectedArmyId));
                if (!army) {
                    throw new Error(`Could not find army of id ${this.$scope.selectedArmyId}.`);
                }
                this.$scope.selectedIds = army.deploymentIds.slice(0);
                this.$scope.armyTitle = army.title;
            }
            removeArmy() {
                if (this.$scope.selectedArmyId === ArmyController.ID_NEW) {
                    return;
                }
                this.armyCache.removeArmy(parseInt(this.$scope.selectedArmyId));
                this.selectNewArmyOption();
            }
            getArmy(id) {
                for (let army of this.$scope.armies) {
                    if (army.id === id) {
                        return army;
                    }
                }
                return null;
            }
            onListLoaded(res) {
                this.$scope.availableIds = [];
                this.$scope.deployments = {};
                this.$scope.selectedIds = [];
                for (let item of res.data.array) {
                    let info = item;
                    this.$scope.availableIds.push(info.id);
                    this.$scope.deployments[info.id] = info.title;
                }
            }
            removeDeployment(index) {
                this.$scope.selectedIds.splice(index, 1);
            }
            addDeployment(id) {
                this.$scope.selectedIds.push(id);
            }
            saveArmy() {
                this.armyCache.saveArmy(this.$scope.armyTitle || this.createTitle(), this.$scope.selectedIds);
                this.selectNewArmyOption();
            }
            createTitle() {
                var title = "";
                let MAX_LEN = 50;
                for (let id of this.$scope.selectedIds) {
                    if (title.length > 0) {
                        title += ", ";
                    }
                    title += this.$scope.deployments[id].title;
                    if (title.length >= MAX_LEN) {
                        title += "...";
                        break;
                    }
                }
                return title;
            }
            selectNewArmyOption() {
                this.$scope.selectedArmyId = ArmyController.ID_NEW;
                this.$scope.selectedIds = [];
                this.$scope.armyTitle = null;
            }
        }
        ArmyController.NAME = "armyController";
        ArmyController.PATH = "/army";
        ArmyController.HTML_NAME = "army";
        ArmyController.DEPLOYMENTS_LIST_PATH = "assets/json/deployment/deployments.json";
        ArmyController.ID_NEW = "__new__";
        Ng.ArmyController = ArmyController;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.controller(App.Ng.ArmyController.NAME, [
    '$rootScope',
    '$scope',
    '$http',
    App.Ng.ArmyCache.NAME,
    App.Ng.ArmyController
]);
/// <reference path="../modules/App.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class RootController {
            constructor($scope, $http, stateCache) {
                this.stateCache = stateCache;
                this.$scope = $scope;
                this.$scope.saveUrls = new Array();
                let req = this.createRequest();
                $http(req).then(this.onSkirmishListLoad.bind(this));
            }
            onSkirmishListLoad(res) {
                this.$scope.skirmishes = res.data.array;
                for (let state of this.stateCache.states) {
                    let text = this.createText(state, this.$scope.skirmishes);
                    let url = `#/skirmish/${state.skirmish_id}?state=${state.id}&initiative=${state.initiative}`;
                    if (state.red) {
                        url += '&red=' + state.red;
                    }
                    if (state.blue) {
                        url += '&blue=' + state.blue;
                    }
                    this.$scope.saveUrls.push({ text: text, url: url });
                }
            }
            createRequest() {
                return {
                    url: "assets/json/skirmish/skirmishes.json",
                    method: 'GET',
                    cache: true
                };
            }
            createText(save, skirmishes) {
                let name = "<not found>";
                for (let info of skirmishes) {
                    if (info.id === save.skirmish_id) {
                        name = info.title;
                    }
                }
                let date = new Date(save.timestamp);
                // month is 0-based
                return `${name} @ ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            }
        }
        RootController.NAME = "rootController";
        RootController.PATH = "/";
        RootController.HTML_NAME = "root";
        Ng.RootController = RootController;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.controller(App.Ng.RootController.NAME, [
    '$scope',
    '$http',
    App.Ng.StateCache.NAME,
    App.Ng.RootController
]);
/// <reference path="../modules/App.ts"/>
/// <reference path="../services/AbilityLoader.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class ScriptLoaderController {
            constructor($scope, $timeout, abilityLoader) {
                abilityLoader.loadRequestListener = this;
                this.$scope = $scope;
                this.$scope.scripts = new Array();
                this.$timeout = $timeout;
            }
            requestScript(src) {
                if (this.isScriptRegistered(src)) {
                    return false;
                }
                this.$scope.scripts.push({ src: src });
                this.$timeout(angular.noop);
                return true;
            }
            isScriptRegistered(src) {
                for (let script of this.$scope.scripts) {
                    if (script.src === src) {
                        return true;
                    }
                }
                return false;
            }
        }
        ScriptLoaderController.NAME = "scriptLoaderController";
        Ng.ScriptLoaderController = ScriptLoaderController;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.controller(App.Ng.ScriptLoaderController.NAME, [
    '$scope',
    '$timeout',
    App.Ng.AbilityLoader.NAME,
    App.Ng.ScriptLoaderController
]);
/// <reference path="../modules/App.ts"/>
/// <reference path="../services/StateCache.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class SkirmishController {
            constructor($scope) {
                this.$scope = $scope;
                this.$scope.saveState = this.saveState.bind(this);
            }
            saveState() {
                this.$scope.$broadcast(SkirmishController.EVENT_SAVE_STATE);
            }
        }
        SkirmishController.NAME = "skirmishController";
        SkirmishController.PATH = "/skirmish/:skirmish_id";
        SkirmishController.HTML_NAME = "skirmish";
        SkirmishController.EVENT_SAVE_STATE = "save_state";
        Ng.SkirmishController = SkirmishController;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.controller(App.Ng.SkirmishController.NAME, [
    '$scope',
    App.Ng.StateCache.NAME,
    App.Ng.SkirmishController
]);
/// <reference path="../modules/App.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class SkirmishSetupController {
            constructor($scope, $routeParams, armyCache) {
                this.$scope = $scope;
                this.$scope.skirmishId = $routeParams.id;
                this.$scope.armies = armyCache.armies;
                this.$scope.firstArmy = armyCache.armies[0].id.toString();
                this.$scope.secondArmy = this.$scope.firstArmy;
            }
        }
        SkirmishSetupController.NAME = "skirmishSetupController";
        SkirmishSetupController.PATH = "/skirmish/:id/setup";
        SkirmishSetupController.HTML_NAME = "skirmish-setup";
        Ng.SkirmishSetupController = SkirmishSetupController;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.controller(App.Ng.SkirmishSetupController.NAME, [
    '$scope',
    '$routeParams',
    App.Ng.ArmyCache.NAME,
    App.Ng.SkirmishSetupController
]);
/// <reference path="../modules/App.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class TileBuilderController {
            constructor($scope) {
                this.selectedLocations = {};
                this.$scope = $scope;
                this.$scope.sideValues = ["", "wall", "blocking_terrain", "difficult_terrain", "impassable_terrain"];
                this.$scope.sideKeys = ["top", "left", "bottom", "right"];
                this.$scope.colCount = 4;
                this.$scope.rowCount = 4;
                this.$scope.toggleSpace = this.toggleSpace.bind(this);
                this.$scope.isSelected = this.isSelected.bind(this);
                this.$scope.export = this.export.bind(this);
                this.$scope.selectSide = this.selectSide.bind(this);
            }
            isSelected(x, y) {
                let key = `${x},${y}`;
                return key in this.selectedLocations;
            }
            toggleSpace(x, y) {
                let key = `${x},${y}`;
                if (key in this.selectedLocations) {
                    delete this.selectedLocations[key];
                }
                else {
                    this.selectedLocations[key] = new TileBuilderController.Space(x, y);
                    this.$scope.selectedKey = key;
                }
                delete this.$scope.top;
                delete this.$scope.left;
                delete this.$scope.bottom;
                delete this.$scope.right;
            }
            selectSide() {
                let space = this.selectedLocations[this.$scope.selectedKey];
                space.top = this.$scope.top;
                space.left = this.$scope.left;
                space.bottom = this.$scope.bottom;
                space.right = this.$scope.right;
            }
            export() {
                let map = new Array();
                for (let key in this.selectedLocations) {
                    let data = this.selectedLocations[key];
                    let space = {
                        "x": data.x,
                        "y": data.y
                    };
                    if (data.top) {
                        space["top"] = data.top;
                    }
                    if (data.left) {
                        space["left"] = data.left;
                    }
                    if (data.bottom) {
                        space["bottom"] = data.bottom;
                    }
                    if (data.right) {
                        space["right"] = data.right;
                    }
                    map.push(space);
                }
                this.$scope.tileJson = JSON.stringify({ "spaces": map });
            }
        }
        TileBuilderController.NAME = "tileBuilderController";
        TileBuilderController.PATH = "/tile-builder";
        TileBuilderController.HTML_NAME = "tile-builder";
        Ng.TileBuilderController = TileBuilderController;
        (function (TileBuilderController) {
            class Space {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                }
            }
            TileBuilderController.Space = Space;
        })(TileBuilderController = Ng.TileBuilderController || (Ng.TileBuilderController = {}));
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.controller(App.Ng.TileBuilderController.NAME, [
    '$scope',
    App.Ng.TileBuilderController
]);
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        /**
         * This directive exists because if the script src attr is populated
         * with angular-formatted arguments, the page will attempt to load those non-urls.
         */
        class LazySrcDirective {
            constructor($scope, $element, $attr) {
                // Will get called initially as well as updates
                $scope.$watch(function () {
                    return $element.attr('data-lazy-src');
                }, function (value) {
                    $element.attr('src', $attr[LazySrcDirective.NAME]);
                });
            }
        }
        LazySrcDirective.NAME = "lazySrc";
        LazySrcDirective.RESTRICT = "A";
        LazySrcDirective.counter = 1;
        Ng.LazySrcDirective = LazySrcDirective;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.directive(App.Ng.LazySrcDirective.NAME, function () {
    return {
        restrict: App.Ng.LazySrcDirective.RESTRICT,
        link: function ($scope, $element, $attr) {
            new App.Ng.LazySrcDirective($scope, $element, $attr);
        }
    };
});
/// <references path="util/SpaceRenderer.ts"/>
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        class SpaceDirective {
            constructor($scope, $element, $attr) {
                let canvas = $element[0];
                this.ctx = canvas.getContext("2d");
                this.uiSpace = $scope.space;
                let boundRender = this.render.bind(this);
                $scope.$watch('space.points', boundRender);
            }
            render() {
                let w = this.ctx.canvas.width;
                let h = this.ctx.canvas.height;
                this.ctx.clearRect(0, 0, w, h);
                Ng.Util.SpaceRenderer.renderSpace(this.ctx, this.uiSpace.space);
                if (this.uiSpace.points !== null) {
                    this.renderSpaceCost(w);
                }
            }
            renderSpaceCost(size) {
                this.ctx.strokeStyle = "black";
                this.ctx.setLineDash([]);
                this.ctx.lineWidth = 1;
                this.ctx.textAlign = "center";
                let r = size / 2;
                this.ctx.strokeText(`${this.uiSpace.points}`, r, r);
            }
        }
        SpaceDirective.NAME = "spaceRender";
        SpaceDirective.RESTRICT = "A";
        SpaceDirective.ISOLATE_SCOPE = {
            space: "=",
            rctx: "=",
        };
        Ng.SpaceDirective = SpaceDirective;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.directive(App.Ng.SpaceDirective.NAME, function () {
    return {
        restrict: App.Ng.SpaceDirective.RESTRICT,
        scope: App.Ng.SpaceDirective.ISOLATE_SCOPE,
        link: function ($scope, $element, $attr) {
            new App.Ng.SpaceDirective($scope, $element, $attr);
        }
    };
});
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        /**
         * This directive exists because if the script src attr is populated
         * with angular-formatted arguments, the page will attempt to load those non-urls.
         */
        class SymbolizeDirective {
            constructor($scope, $element, $attr) {
                let fontSize = window.getComputedStyle($element[0]).fontSize;
                var match = null;
                var pattern = /:\w+:/;
                let text = $scope.symbolize;
                while (match = pattern.exec(text)) {
                    // ":surge:" to "surge"
                    let name = match[0].substr(1, match[0].length - 2).toLowerCase();
                    if (SymbolizeDirective.EXCLUSIONS.indexOf(name) === -1) {
                        text = text.replace(match[0], `<img 
                            class=\"symbol\" 
                            src="assets/png/symbol/${name}.png"
                            style="height: ${fontSize}"/>`);
                    }
                    else {
                        text = text.replace(match[0], name);
                    }
                }
                $element[0].innerHTML = text;
            }
        }
        SymbolizeDirective.NAME = "symbolize";
        SymbolizeDirective.RESTRICT = "A";
        SymbolizeDirective.ISOLATE_SCOPE = {
            symbolize: '='
        };
        SymbolizeDirective.EXCLUSIONS = ["accuracy"];
        Ng.SymbolizeDirective = SymbolizeDirective;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.directive(App.Ng.SymbolizeDirective.NAME, function () {
    return {
        restrict: App.Ng.SymbolizeDirective.RESTRICT,
        scope: App.Ng.SymbolizeDirective.ISOLATE_SCOPE,
        link: function ($scope, $element, $attr) {
            new App.Ng.SymbolizeDirective($scope, $element, $attr);
        }
    };
});
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        const TWO_PI = Math.PI * 2;
        const HALF_PI = Math.PI / 2;
        const BORDER_SIZE = 5;
        class UnitDirective {
            constructor($scope, $element) {
                let canvas = $element[0];
                this.ctx = canvas.getContext("2d");
                this.unit = $scope.unit;
                this.targetable = false;
                this.targeted = false;
                switch ($scope.unit.deployment.rank) {
                    case App.Game.Unit.CLASS_ELITE:
                        this.classColor = "red";
                        break;
                    case App.Game.Unit.CLASS_REGULAR:
                        this.classColor = "grey";
                        break;
                    default:
                        throw new Error(`Unsupported unit class: ${$scope.unit.deployment.rank}`);
                }
                $scope.$watch("unit.health", this.render.bind(this));
                $scope.$watch("targetable", this.checkTargetable.bind(this));
                $scope.$watch("targeted", this.checkTargeted.bind(this));
            }
            checkTargetable(newValue, oldValue) {
                this.targetable = newValue === undefined ? false : newValue;
                this.render();
            }
            checkTargeted(newValue, oldValue) {
                this.targeted = newValue === undefined ? false : newValue;
                this.render();
            }
            render() {
                let w = this.ctx.canvas.width;
                let h = this.ctx.canvas.height;
                this.ctx.clearRect(0, 0, w, h);
                this.drawBase(w, h);
                this.drawImage(w, h);
                this.drawHealth(w, h);
                this.drawAffiliation(w, h);
                if (this.targetable) {
                    this.drawTarget(w, h, "yellow");
                }
                if (this.targeted) {
                    this.drawTarget(w, h, "red");
                }
            }
            drawBase(w, h) {
                let r = w / 2;
                this.ctx.fillStyle = "black";
                this.ctx.beginPath();
                this.ctx.arc(r, r, r, 0, TWO_PI);
                this.ctx.fill();
            }
            drawImage(w, h) {
                let size = w - (2 * BORDER_SIZE);
                this.ctx.drawImage(this.unit.deployment.image, BORDER_SIZE, BORDER_SIZE, size, size);
            }
            drawHealth(w, h) {
                let healthAngle = (this.unit.health / this.unit.deployment.health) * TWO_PI;
                // Center of border
                let r = w / 2;
                let healthR = (w / 2) - (BORDER_SIZE / 2);
                this.ctx.strokeStyle = this.classColor;
                // Visible edges
                this.ctx.lineWidth = BORDER_SIZE - 2;
                this.ctx.beginPath();
                this.ctx.arc(r, r, healthR, HALF_PI, healthAngle + HALF_PI);
                this.ctx.stroke();
            }
            drawAffiliation(w, h) {
                let r = w / 2;
                let ar = 5;
                this.ctx.fillStyle = App.Game.ZoneColor[this.unit.zoneColor].toLowerCase();
                this.ctx.beginPath();
                this.ctx.arc(r, h - ar, ar, 0, TWO_PI);
                this.ctx.fill();
            }
            drawTarget(w, h, color) {
                this.ctx.fillStyle = color;
                this.ctx.font = `${w}px FontAwesome`;
                this.ctx.textAlign = "center";
                let symbol = String.fromCharCode(0xf140);
                this.ctx.fillText(symbol, w / 2, h * .8);
            }
        }
        UnitDirective.NAME = "unitRender";
        UnitDirective.RESTRICT = "A";
        UnitDirective.ISOLATE_SCOPE = {
            unit: '=',
            targetable: '=',
            targeted: '='
        };
        Ng.UnitDirective = UnitDirective;
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
App.Ng.module.directive(App.Ng.UnitDirective.NAME, function () {
    return {
        restrict: App.Ng.UnitDirective.RESTRICT,
        scope: App.Ng.UnitDirective.ISOLATE_SCOPE,
        link: function ($scope, $element, $attr) {
            new App.Ng.UnitDirective($scope, $element);
        }
    };
});
"use strict";
var App;
(function (App) {
    var Ng;
    (function (Ng) {
        var Util;
        (function (Util) {
            var SpaceRenderer;
            (function (SpaceRenderer) {
                const BORDER_STYLE = {};
                const BORDER_DASH = {};
                (function () {
                    BORDER_STYLE[App.Game.Border.WALL] = "black";
                    BORDER_STYLE[App.Game.Border.BLOCKING] = "red";
                    BORDER_STYLE[App.Game.Border.IMPASSABLE] = "red";
                    BORDER_STYLE[App.Game.Border.DIFFICULT] = "blue";
                    BORDER_DASH[App.Game.Border.WALL] = [];
                    BORDER_DASH[App.Game.Border.BLOCKING] = [];
                    BORDER_DASH[App.Game.Border.DIFFICULT] = [];
                    BORDER_DASH[App.Game.Border.IMPASSABLE] = [5, 5];
                })();
                const KEY_INDOORS_TO_FOREST = "indoors-to-forest";
                const KEY_DESERT_TO_INDOORS_SCUM = "desert-to-indoors-scum";
                const TERRAIN_FILL = {
                    "forest": "green",
                    "desert-indoors": "tan",
                    "desert": "tan",
                    "indoors": "purple",
                    "indoors-scum": "#aaa"
                };
                function renderSpace(ctx, space) {
                    let size = ctx.canvas.width;
                    // For lines to layer correctly, has to be two passes: background then lines on top
                    drawSpaceBackground(size, ctx, space);
                    drawSpaceEdge(ctx, 0, 0, size, 0, space.top);
                    drawSpaceEdge(ctx, 0, 0, 0, size, space.left);
                    drawSpaceEdge(ctx, 0, size, size, size, space.bottom);
                    drawSpaceEdge(ctx, size, 0, size, size, space.right);
                    if (space.deploymentZoneColor !== null) {
                        drawDeploymentZone(ctx, size, space.deploymentZoneColor);
                    }
                }
                SpaceRenderer.renderSpace = renderSpace;
                function drawSpaceBackground(size, ctx, space) {
                    switch (space.terrain) {
                        case KEY_INDOORS_TO_FOREST:
                            ctx.fillStyle = createIndoorsToForest(ctx, size, space.rotation);
                            break;
                        case KEY_DESERT_TO_INDOORS_SCUM:
                            ctx.fillStyle = createDesertToIndoorsScum(ctx, size, space.rotation);
                            break;
                        default:
                            ctx.fillStyle = TERRAIN_FILL[space.terrain];
                            break;
                    }
                    ctx.strokeStyle = "grey";
                    // Space background
                    ctx.fillRect(0, 0, size, size);
                    // Space Edge
                    let edge = 1;
                    ctx.lineWidth = edge;
                    ctx.setLineDash([]);
                    ctx.rect((edge / 2), (edge / 2), size, size);
                    ctx.stroke();
                }
                function drawSpaceEdge(ctx, x1, y1, x2, y2, border) {
                    if (!border) {
                        return;
                    }
                    ctx.strokeStyle = BORDER_STYLE[border];
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.setLineDash(BORDER_DASH[border]);
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
                function drawDeploymentZone(ctx, size, color) {
                    ctx.globalAlpha = 0.3;
                    ctx.fillStyle = color;
                    ctx.fillRect(0, 0, size, size);
                    ctx.globalAlpha = 1;
                }
                function createDesertToIndoorsScum(ctx, size, rotation) {
                    let clrStop0;
                    let clrStop1;
                    let desert = TERRAIN_FILL["desert"];
                    let indoorScum = TERRAIN_FILL["indoors-scum"];
                    let w = 0;
                    let h = 0;
                    switch (rotation) {
                        case 0:
                            w = size;
                            clrStop0 = indoorScum;
                            clrStop1 = desert;
                            break;
                        case 90:
                            h = size;
                            clrStop0 = indoorScum;
                            clrStop1 = desert;
                            break;
                        case 180:
                            w = size;
                            clrStop0 = desert;
                            clrStop1 = indoorScum;
                            break;
                        case 270:
                            h = size;
                            clrStop0 = desert;
                            clrStop1 = indoorScum;
                            break;
                        default:
                            throw new Error(`Unsupported rotation: ${rotation}`);
                    }
                    let grd = ctx.createLinearGradient(0, 0, w, h);
                    grd.addColorStop(0, clrStop0);
                    grd.addColorStop(1, clrStop1);
                    return grd;
                }
                function createIndoorsToForest(ctx, size, rotation) {
                    let clrStop0;
                    let clrStop1;
                    let indoors = TERRAIN_FILL["indoors"];
                    let forest = TERRAIN_FILL["forest"];
                    let w = 0;
                    let h = 0;
                    switch (rotation) {
                        case 0:
                            w = size;
                            clrStop0 = forest;
                            clrStop1 = indoors;
                            break;
                        case 90:
                            h = size;
                            clrStop0 = forest;
                            clrStop1 = indoors;
                            break;
                        case 180:
                            w = size;
                            clrStop0 = indoors;
                            clrStop1 = forest;
                            break;
                        case 270:
                            h = size;
                            clrStop0 = indoors;
                            clrStop1 = forest;
                            break;
                        default:
                            throw new Error(`Unsupported rotation: ${rotation}`);
                    }
                    let grd = ctx.createLinearGradient(0, 0, w, h);
                    grd.addColorStop(0, clrStop0);
                    grd.addColorStop(1, clrStop1);
                    return grd;
                }
            })(SpaceRenderer = Util.SpaceRenderer || (Util.SpaceRenderer = {}));
        })(Util = Ng.Util || (Ng.Util = {}));
    })(Ng = App.Ng || (App.Ng = {}));
})(App || (App = {}));
//# sourceMappingURL=app.js.map