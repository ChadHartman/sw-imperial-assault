namespace App.Game {
    export interface ISurge {
        cost: number;
        modifiers: Array<IModifier>;
    }

    export module ISurge {
        export function parse(data: Model.ISurge): ISurge {
            let surge = {
                cost: data.cost,
                modifiers: new Array<IModifier>()
            };
            try {
            for (let modifier of data.modifiers) {
                surge.modifiers.push(IModifier.parse(modifier));
            }
            } catch(e) {
                console.error(e);
                console.error(data);
                throw e;
            }
            return surge;
        }
    }
}