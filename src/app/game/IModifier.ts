namespace App.Game {
    
    export interface IModifier {
        type: Attribute;
        value?: number;
        status?: StatusEffect;
    }

    export module IModifier {
        export function parse(data: Model.IModifier): IModifier {

            let modifier = {
                type: Attribute.parse(data.type)
            };

            if (data.status) {
                modifier["status"] = StatusEffect.parse(data.status);
            }

            if (data.value) {
                modifier["value"] = data.value;
            }

            return modifier;
        }
    }
}
