namespace App.Model {

    export interface IModifier {
        type: string;
        value?: number;
        status?: string;
    }

    export interface ISurge {
        cost: number;
        modifiers: Array<IModifier>;
    }

    export interface IAttack {
        type: string;
        dice: Array<string>;
    }

    export interface IDeployment {
        title: string;
        rank: string;
        width: number;
        height: number;
        group_size: number;
        deployment_cost: number;
        health: number;
        speed: number;
        attack: IAttack;
        defense: Array<string>;
        abilities: Array<string>;
        surges: Array<ISurge>;
        image_url: string;
    }
}