namespace App.Game {

    export class Skirmish {

        public readonly spaces: Array<Space>;
        public readonly deploymentZones: Array<App.Model.IDeploymentZone>;

        constructor(
            config: App.Model.ISkirmishConfig,
            tiles: Array<App.Model.ITile>) {

            this.spaces = new Array<Space>();
            this.deploymentZones = config.deployment_zones;

            let tileTable = this.createTileTable(tiles);

            for (let tileInfo of config.tiles) {
                let tile = tileTable[tileInfo.tile_id];
                this.addSpaces(
                    tileInfo.x,
                    tileInfo.y,
                    tileInfo.rotation || 0,
                    tile);
            }
        }

        private createTileTable(tiles: Array<App.Model.ITile>): [string, App.Model.ITile] {
            let table = <[string, App.Model.ITile]>{};
            for (let tile of tiles) {
                table[tile.id] = tile;
            }
            return table;
        }

        private addSpaces(offsetX: number, offsetY: number, rotation: number, tile: App.Model.ITile) {
            let maxX = this.getMax(tile, "x");
            let maxY = this.getMax(tile, "y");
            let x: number;
            let y: number;
            let left: string;
            let top: string;
            let bottom: string;
            let right: string;

            for (let space of tile.spaces) {
                switch (rotation) {
                    case 0:
                        x = offsetX + space.x;
                        y = offsetY + space.y;
                        top = space.top;
                        left = space.left;
                        bottom = space.bottom;
                        right = space.right;
                        break;
                    case 90:
                        x = offsetX + maxY - space.y;
                        y = offsetY + space.x;
                        top = space.left;
                        left = space.bottom;
                        bottom = space.right;
                        right = space.top;
                        break;
                    case 180:
                        x = offsetX + maxX - space.x;
                        y = offsetY + maxY - space.y;
                        top = space.bottom;
                        left = space.right;
                        bottom = space.top;
                        right = space.left;
                        break;
                    case 270:
                        x = offsetX + space.y;
                        y = offsetY + maxX - space.x;
                        top = space.right;
                        left = space.top;
                        bottom = space.left;
                        right = space.bottom;
                        break;
                    default:
                        throw new Error("Unsupported rotation:" + rotation);
                }

                let dZoneColor = this.getDeploymentZoneColor(x, y);
                let mapSpace = new Space(
                    x, y,
                    top, left, bottom, right,
                    rotation, tile.terrain, dZoneColor);
                this.spaces.push(mapSpace);
            }
        }

        private getDeploymentZoneColor(x: number, y: number): string | null {
            for (let zone of this.deploymentZones) {
                for (let space of zone.spaces) {
                    if (space.x === x && space.y === y) {
                        return zone.color;
                    }
                }
            }

            return null;
        }

        private getMax(tile: App.Model.ITile, attribute: string) {
            var max = 0;
            for (let space of tile.spaces) {
                if (space[attribute] > max) {
                    max = space[attribute];
                }
            }
            return max;
        }
    }
}