namespace App.Model {
    export interface IEffect {
        type: string;
        stat: string;
    }

    export interface ITarget {
        requirements: Array<string>;
    }

    export interface IAbility {
        title: string;
        scope: Array<string>;
        targets: Array<ITarget>;
        effects: Array<IEffect>;
    }
}