namespace App.Game.Engine.Util {

    enum Orientation {
        TOP_RIGHT,
        TOP,
        TOP_LEFT,
        LEFT,
        BOTTOM_LEFT,
        BOTTOM,
        BOTTOM_RIGHT,
        RIGHT,
        CENTER
    }

    function orientation(x1: number, y1: number, x2: number, y2: number): Orientation {
        if (y1 > y2) {
            if (x1 > x2) {
                return Orientation.TOP_LEFT;
            } else if (x1 < x2) {
                return Orientation.TOP_RIGHT
            } else {
                return Orientation.TOP;
            }
        } else if (y1 < y2) {
            if (x1 > x2) {
                return Orientation.BOTTOM_LEFT;
            } else if (x1 < x2) {
                return Orientation.BOTTOM_RIGHT;
            } else {
                return Orientation.BOTTOM;
            }
        } else {
            if (x1 > x2) {
                return Orientation.LEFT;
            } else if (x1 < x2) {
                return Orientation.RIGHT;
            } else {
                return Orientation.CENTER;
            }
        }
    }

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

    export function accessible(
        x1: number, y1: number,
        x2: number, y2: number,
        spaces: Array<Space>): boolean {

        let s1 = findSpace(x1, y1, spaces);
        let s2 = findSpace(x2, y2, spaces);

        if (s1 === null || s2 === null) {
            return false;
        }

        let upRoute: boolean;
        let downRoute: boolean;
        let leftRoute: boolean;
        let rightRoute: boolean;

        switch (orientation(x1, y1, x2, y2)) {
            case Orientation.TOP_RIGHT:
                upRoute = !obstructed(s1.top) && !obstructed(s2.left);
                rightRoute = !obstructed(s1.right) && !obstructed(s2.bottom);
                return upRoute || rightRoute;
            case Orientation.TOP:
                return !obstructed(s1.top);
            case Orientation.TOP_LEFT:
                upRoute = !obstructed(s1.top) && !obstructed(s2.right);
                leftRoute = !obstructed(s1.left) && !obstructed(s2.bottom);
                return upRoute || leftRoute;
            case Orientation.LEFT:
                return !obstructed(s1.left);
            case Orientation.BOTTOM_LEFT:
                downRoute = !obstructed(s1.bottom) && !obstructed(s2.right);
                leftRoute = !obstructed(s1.left) && !obstructed(s2.top);
                return downRoute || leftRoute;
            case Orientation.BOTTOM:
                return !obstructed(s1.bottom);
            case Orientation.BOTTOM_RIGHT:
                downRoute = !obstructed(s1.bottom) && !obstructed(s2.left);
                rightRoute = !obstructed(s1.right) && !obstructed(s2.top);
                return downRoute || rightRoute;
            case Orientation.RIGHT:
                return !obstructed(s1.right);
            case Orientation.CENTER:
                return true;
        }
    }
}