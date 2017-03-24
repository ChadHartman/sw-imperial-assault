namespace App.Model {

    export interface IEffect {
        type:string;
        stat:string;
    }

    export interface IAbility {
        title:string;
        scope:Array<string>;
        targets:Array<string>;
        effects:Array<IEffect>;
    }  
}