namespace SwiaEngine.Game {

    export enum ZoneColor {
        RED, BLUE
    }

    export function toZoneColor(color: string): ZoneColor {
        let zoneColor = ZoneColor[color.toUpperCase()];
        if (zoneColor === undefined) {
            throw new Error(`Invalid Zone Color: ${color}`);
        }
        return zoneColor;
    }

}