namespace App.Game {
    export enum StatusEffect {
        STUN,
        BLEED,
        WEAKENED,
        FOCUSED,
        HIDDEN
    }

    export module StatusEffect {
        export function parse(name: string): StatusEffect {
            let attr = StatusEffect[name.toUpperCase()];
            if (attr !== undefined) {
                return attr;
            }
            throw new Error(`Unknown StatusEffect: ${name}`);
        }
    }
}