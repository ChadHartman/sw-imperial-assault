namespace App.Model {

    export interface IDeploymentZone {
        color: string;
        spaces: Array<ICoordinate>;
    }

    export interface ITileConfig {
        tile_id: string;
        x: number;
        y: number;
        rotation: number;
    }

    export interface ISkirmishConfig {
        deployment_zones: Array<IDeploymentZone>;
        tiles: Array<ITileConfig>;
    }
}