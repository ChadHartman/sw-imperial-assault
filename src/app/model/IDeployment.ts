namespace App.Model {

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
        image_url: string;
    }
}