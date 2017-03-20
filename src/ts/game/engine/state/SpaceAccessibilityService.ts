namespace App.Game.Engine.State {

    function obstructed(border: Border): boolean {
        return border === Game.Border.BLOCKING ||
            border === Game.Border.IMPASSABLE ||
            border === Game.Border.WALL;
    }

    export function findSpace(x: number, y: number, spaces: Array<Space>): Space | null {
        for (let space of spaces) {
            if (space.x === x && space.y === y) {
                return space;
            }
        }
        return null;
    }

    export class SpaceAccessibilityService {
        private readonly spaces: Array<Space>;

        constructor(spaces: Array<Space>) {
            this.spaces = spaces;
        }

        public accessible(x1: number, y1: number, x2: number, y2: number): boolean {

            let s1 = findSpace(x1, y1, this.spaces);
            let s2 = findSpace(x2, y2, this.spaces);

            if (s1 === null || s2 === null) {
                return false;
            }

            if (y1 > y2) {

                // s2 is above
                if (x1 > x2) {
                    // s2 is above-left
                    let upRoute = !obstructed(s1.top) && !obstructed(s2.right);
                    let leftRoute = !obstructed(s1.left) && !obstructed(s2.bottom);
                    return upRoute || leftRoute;
                }

                if (x1 < x2) {
                    // s2 is above-right
                    let upRoute = !obstructed(s1.top) && !obstructed(s2.left);
                    let rightRoute = !obstructed(s1.right) && !obstructed(s2.bottom);
                    return upRoute || rightRoute;
                }

                return !obstructed(s1.top);
            }

            if (y1 < y2) {

                // s2 is below
                if (x1 > x2) {
                    // s2 is below-left
                    let downRoute = !obstructed(s1.bottom) && !obstructed(s2.right);
                    let leftRoute = !obstructed(s1.left) && !obstructed(s2.top);
                    return downRoute || leftRoute;
                } else if (x1 < x2) {
                    // s2 is below-right
                    let downRoute = !obstructed(s1.bottom) && !obstructed(s2.left);
                    let rightRoute = !obstructed(s1.right) && !obstructed(s2.top);
                    return downRoute || rightRoute;
                }

                return !obstructed(s1.bottom);
            }

            if (x1 > x2) {
                // s2 is left
                return !obstructed(s1.left);
            }

            if (x1 < x2) {
                // s2 is right
                return !obstructed(s1.right);
            }

            // Same space, accessible to itself
            console.error(`Unreachable code: ${x1},${y1} -> ${x2},${y2}`)
            return true;
        }
    }
}