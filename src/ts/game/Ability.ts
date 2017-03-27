namespace App.Game {

    export enum Scope {
        ACTION,
        SPECIAL_ACTION,
        DEFENDING,
        ATTACKING,
        ADJACENT_FRIENDLY,
        END_OF_ROUND
    }

    export enum Target {
        SELF,
        SPACE,
        HOSTILE_FIGURE
    }

    function toScope(scope: string): Scope {
        let enumScope = Scope[scope.toUpperCase()];
        if (enumScope === undefined) {
            throw new Error(`Unknown ability scope ${scope}`);
        }
        return enumScope;
    }

    function toTarget(target: string): Target {
        let value = Target[target.toUpperCase()];
        if (value === undefined) {
            throw new Error(`Unknown ability scope ${target}`);
        }
        return value;
    }

    export class Ability {

        public readonly id: string
        public readonly title: string;
        public readonly scope: Array<Scope>;
        public readonly target: Array<Target>;
        public readonly effects: Array<Effect>;

        constructor(id: string, ability: Model.IAbility) {
            this.id = id;
            this.title = ability.title;
            this.scope = new Array<Scope>();
            this.target = new Array<Target>();
            this.effects = new Array<Effect>();

            for (let scope of ability.scope) {
                this.scope.push(toScope(scope));
            }

            if (ability.targets) {
                for (let target of ability.targets) {
                    this.target.push(toTarget(target));
                }
            }

            if (ability.effects) {
                for (let effect of ability.effects) {
                    this.effects.push(new Effect(effect));
                }
            }
        }
    }
}