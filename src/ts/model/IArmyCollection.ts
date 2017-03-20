namespace App.Model {

    export interface IArmy {
        readonly id: number;
        readonly title: string;
        readonly deploymentIds: Array<string>;
    }

    export interface IArmyCollection {
        __last_id__: number;
        readonly armies: Array<IArmy>;
    }

    export function createArmy(
        title: string,
        deploymentIds: Array<string>,
        armyCollection: IArmyCollection): IArmy {

        let newArmy = {
            "id": armyCollection.__last_id__++,
            "title": title,
            "deploymentIds": deploymentIds
        };

        armyCollection.armies.push(newArmy);
        
        return newArmy;
    }

    export function createArmyCollection(): IArmyCollection {
        return {
            "__last_id__": 1,
            "armies": []
        };
    }
}