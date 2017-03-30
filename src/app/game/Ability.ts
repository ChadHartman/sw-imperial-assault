namespace App.Game {

    export enum Scope {
        ACTION,
        SPECIAL_ACTION,
        DEFENDING,
        ATTACKING,
        ADJACENT_FRIENDLY,
        END_OF_ROUND
    }

    function toScope(scope: string): Scope {
        let enumScope = Scope[scope.toUpperCase()];
        if (enumScope === undefined) {
            throw new Error(`Unknown ability scope ${scope}`);
        }
        return enumScope;
    }

    export class Ability {

        public readonly id: string
        public readonly title: string;
        public readonly targets: Array<Target>;

        private readonly scope: Array<Scope>;
        private readonly effects: Array<Effect>;

        constructor(id: string, ability: Model.IAbility) {
            this.id = id;
            this.title = ability.title;
            this.scope = new Array<Scope>();
            this.targets = new Array<Target>();
            this.effects = new Array<Effect>();

            for (let scope of ability.scope) {
                this.scope.push(toScope(scope));
            }

            if (ability.targets) {
                for (let target of ability.targets) {
                    this.targets.push(new Target(target));
                }
            }

            if (ability.effects) {
                for (let effect of ability.effects) {
                    this.effects.push(new Effect(effect));
                }
            }
        }

        public get isAction() {
            return this.scope.indexOf(Scope.ACTION) !== -1;
        }

        public get isSpecialAction() {
            return this.scope.indexOf(Scope.SPECIAL_ACTION) !== -1;
        }

        public canTargetUnit(actor: Unit, unit: Unit): boolean {
            for (let target of this.targets) {
                if (target.validTargetUnit(actor, unit)) {
                    return true;
                }
            }
            return false;
        }

        public canTargetSpace(actor: Unit, space: Space): boolean {
            for (let target of this.targets) {
                if (target.validTargetSpace(actor, space)) {
                    return true;
                }
            }
            return false;
        }
    }
}