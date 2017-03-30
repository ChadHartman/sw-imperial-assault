namespace App.Ng.SkirmishPlayer.UiUtils {
    export function findSpace(x: number, y: number, uiSpaces: Array<UiSpace>): UiSpace | null {
        for (let uiSpace of uiSpaces) {
            if (uiSpace.space.x === x && uiSpace.space.y === y) {
                return uiSpace;
            }
        }
        return null;
    }
}