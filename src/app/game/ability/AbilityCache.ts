namespace App.Game.Ability {

    export interface LoadListener {
        onAbilityLoad(ability: BaseAbility);
    }

    export const cache = new Array<BaseAbility>();
    export const listeners = new Array<LoadListener>();

    export function addListener(listener: LoadListener) {
        listeners.push(listener);
    }

    export function removeListener(listener: LoadListener) {
        let index = listeners.indexOf(listener);
        if (index === -1) {
            throw new Error("That listener is not registered");
        }
        listeners.splice(index, 1);
    }

    export function loaded(ability: BaseAbility) {
        cache.push(ability);
        for (let listener of listeners) {
            listener.onAbilityLoad(ability);
        }
    }

    export function ability(id: string): BaseAbility | null {
        for (let ability of cache) {
            if (ability.id === id) {
                return ability;
            }
        }
        return null;
    }
}