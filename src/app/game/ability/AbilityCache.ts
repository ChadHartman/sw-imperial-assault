namespace App.Game.Ability {

    export interface LoadListener {
        onAbilityLoad(ability: BaseAbility);
    }

    interface Task {
        listener: LoadListener;
        id: string;
    }

    const cache = new Array<BaseAbility>();
    let tasks = new Array<Task>();

    function dequeue() {

        let queue = tasks;
        tasks = new Array<Task>();

        while (queue.length > 0) {

            let task = queue.pop() !;
            let found = false;

            for (let ability of cache) {
                if (ability.id === task.id) {
                    task.listener.onAbilityLoad(ability);
                    found = true;
                    break;
                }
            }

            if (!found) {
                tasks.push(task);
            }
        }
    }

    export function loaded(ability: BaseAbility) {
        cache.push(ability);
        dequeue();
    }

    export function ability(id: string, listener: LoadListener) {
        tasks.push({
            id: id,
            listener: listener
        });
        // Seperate loop
        setTimeout(dequeue, 0);
    }
}