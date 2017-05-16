namespace SwiaEngine.Game.Dice {

    export function attackDie(name: string): AttackDie {
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
        throw new Error(`Unknown attack die: ${name}`);
    }

    export function defenseDie(name: string): DefenseDie {
        switch (name) {
            case "black":
                return BLACK;
            case "white":
                return WHITE;
        }
        throw new Error(`Unknown defense die: ${name}`);
    }
}