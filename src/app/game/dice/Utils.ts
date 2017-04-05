namespace App.Game.Dice {

    export interface IAttackResult {
        name: string;
        side: IAttackSide;
    }

    export interface IDefenseResult {
        name: string;
        side: IDefenseSide;
    }

    export interface IRollResult {
        attack: Array<IAttackResult>;
        defense: Array<IDefenseResult>;
        damage: number;
        surge: number;
        range: number;
        dodged: boolean;
    }

    export function roll(...dice: Array<string>): IRollResult {

        let result = {
            attack: new Array<IAttackResult>(),
            defense: new Array<IDefenseResult>(),
            damage: 0,
            surge: 0,
            range: 0,
            dodged: false
        };

        for (let name of dice) {

            let attackDie = getAttackDie(name);
            if (attackDie !== null) {
                let side = attackDie.roll();
                result.attack.push({ name: attackDie.name, side: side });
                result.damage += side.damage;
                result.surge += side.surge;
                result.range += side.range;
                continue;
            }

            let defenseDie = getDefenseDie(name);
            if (defenseDie !== null) {

                let side = defenseDie.roll();
                result.defense.push({ name: defenseDie.name, side: side });
                if (side.dodge > 0) {
                    result.dodged = true;
                }

                result.damage -= side.block;
                result.surge -= side.evade;

                continue;
            }

            throw new Error(`Unknown die: ${name}`);
        }

        return result;
    }

    function getAttackDie(name: string): AttackDie | null {
        switch (name) {
            case "red":
                return RED;
            case "green":
                return GREEN;
            case "blue":
                return BLUE;
            case "yellow":
                return YELLOW;
        }
        return null;
    }

    function getDefenseDie(name: string): DefenseDie | null {
        switch (name) {
            case "black":
                return BLACK;
            case "white":
                return WHITE;
        }
        return null;
    }
}