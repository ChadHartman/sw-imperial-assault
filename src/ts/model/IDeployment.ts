namespace App.Model {

    export interface ISurgeAbility {
        type: string;
        quantity: string;
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
        attack: Array<string>;
        defense: Array<string>;
        actions: Array<string>
        abilities: Array<string>
        surge_abilities: Array<ISurgeAbility>;
        image_url: string;
    }
}