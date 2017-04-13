namespace App.Game {
    export enum Attribute {
        SURGE,
        DAMAGE,
        BLOCK,
        EVADE,
        ACCURACY,
        DODGE,
        STATUS,
        RECOVER,
        PIERCE
    }

    export module Attribute {
        export function parse(name: string): Attribute {
            let attr = Attribute[name.toUpperCase()];
            if (attr !== undefined) {
                return attr;
            }
            throw new Error(`Unknown attribute: ${name}`);
        }
    }
}
