namespace App.Game.Attack {

    export interface IAttackResult {
        damage: number,
        status_effects?: Set<StatusEffect> | null;
    }

    export interface IAttackDieRoll {
        id: number;
        die: Dice.AttackDie;
        side: Dice.IAttackSide;
        rerolled: boolean;
    }

    export interface IDefenseDieRoll {
        id: number;
        die: Dice.DefenseDie;
        side: Dice.IDefenseSide;
        rerolled: boolean;
    }

    export enum Phase {
        DECLARE_TARGET,
        REROLLS,
        APPLY_MODIFIERS,
        SPEND_SURGES,
        CALCULATE_DAMAGE
    }

    function rollAttack(id: number, die: Dice.AttackDie): IAttackDieRoll {
        let side = die.roll();
        return { id: id, die: die, side: side, rerolled: false };
    }

    function rollDefense(id: number, name: string): IDefenseDieRoll {
        let die = Dice.defenseDie(name);
        let side = die.roll();
        return { id: id, die: die, side: side, rerolled: false };
    }

    export abstract class BaseAttack {

        public readonly attacker: Unit;
        public readonly attackRoll: Array<IAttackDieRoll>;
        public readonly defenseRoll: Array<IDefenseDieRoll>;

        protected readonly state: Engine.GameState;

        private readonly modifiers: Array<IModifier>;
        private readonly surges: Array<Surge>;
        private _target: Unit | null;
        private _phase: Phase;

        constructor(attacker: Unit, state: Engine.GameState) {

            this.attacker = attacker;
            this._target = null;
            this.state = state;
            this.attackRoll = new Array<IAttackDieRoll>();
            this.defenseRoll = new Array<IDefenseDieRoll>();
            this.modifiers = new Array<IModifier>();
            this.surges = new Array<Surge>();
            this._phase = Phase.DECLARE_TARGET;
        }

        public set target(target: Unit | null) {

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

        public reroll(id: number) {

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

        public applyModifier(modifier: IModifier) {
            if (this._phase < Phase.APPLY_MODIFIERS) {
                this._phase = Phase.APPLY_MODIFIERS;
            } else if (this._phase > Phase.APPLY_MODIFIERS) {
                throw new Error(`Invalid attack phase ${Phase[this._phase]}`);
            }

            this.modifiers.push(modifier);
        }

        public spendSurge(surge: Surge) {
            if (this._phase < Phase.SPEND_SURGES) {
                this._phase = Phase.SPEND_SURGES;
            } else if (this._phase > Phase.SPEND_SURGES) {
                throw new Error(`Invalid attack phase ${Phase[this._phase]}`);
            }

            if (surge.cost <= this.surge) {
                this.surges.push(surge);
            } else {
                throw new Error("Insufficient surge");
            }
        }

        public get target(): Unit | null {
            return this._target;
        }

        public get surge(): number {
            let total = 0;

            for (let roll of this.attackRoll) {
                total += roll.side.surge;
            }

            for (let roll of this.defenseRoll) {
                total -= roll.side.evade;
            }

            for (let modifier of this.modifiers) {
                if (modifier.type === Attribute.SURGE) {
                    total += modifier.value;
                }
            }

            for (let surge of this.surges) {
                total -= surge.cost;
            }

            return total < 0 ? 0 : total;
        }

        public get phase(): Phase {
            return this._phase;
        }

        private get dodged(): boolean {

            let total = 0;

            for (let roll of this.defenseRoll) {
                total += roll.side.dodge;
            }

            for (let modifier of this.modifiers) {
                if (modifier.type === Attribute.DODGE) {
                    total += modifier.value;
                }
            }

            for (let surge of this.surges) {
                for (let modifier of surge.modifiers) {
                    if (modifier.type === Attribute.DODGE) {
                        total += modifier.value;
                    }
                }
            }

            return total > 0;
        }

        private get accuracy(): number {

            let total = 0;

            for (let roll of this.attackRoll) {
                total += roll.side.range;
            }

            for (let modifier of this.modifiers) {
                if (modifier.type === Attribute.ACCURACY) {
                    total += modifier.value;
                }
            }

            for (let surge of this.surges) {
                for (let modifier of surge.modifiers) {
                    if (modifier.type === Attribute.ACCURACY) {
                        total += modifier.value;
                    }
                }
            }

            return total;
        }

        public abstract targetable(unit: Unit): boolean;

        protected abstract inRange(accuracy: number): boolean;

        public result(): IAttackResult {

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

            let statusEffects: Set<StatusEffect> | null = null;

            for (let modifier of this.modifiers) {
                if (modifier.type === Attribute.STATUS) {
                    if (statusEffects === null) {
                        statusEffects = new Set<StatusEffect>();
                    }
                    statusEffects.add(modifier.status!);
                }
            }

            for (let surge of this.surges) {
                for (let modifier of surge.modifiers) {
                    if (modifier.type === Attribute.STATUS) {
                        if (statusEffects === null) {
                            statusEffects = new Set<StatusEffect>();
                        }
                        statusEffects.add(modifier.status!);
                    }
                }
            }

            return { damage: total, status_effects: statusEffects };
        }
    }
}