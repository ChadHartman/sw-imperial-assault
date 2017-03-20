namespace App.Ng.Util.SpaceRenderer {

    const BORDER_STYLE = {}
    const BORDER_DASH = {};

    (function () {
        BORDER_STYLE[Game.Border.WALL] = "black";
        BORDER_STYLE[Game.Border.BLOCKING] = "red";
        BORDER_STYLE[Game.Border.IMPASSABLE] = "red";
        BORDER_STYLE[Game.Border.DIFFICULT] = "blue";

        BORDER_DASH[Game.Border.WALL] = [];
        BORDER_DASH[Game.Border.BLOCKING] = [];
        BORDER_DASH[Game.Border.DIFFICULT] = [];
        BORDER_DASH[Game.Border.IMPASSABLE] = [5, 5];
    })();

    const KEY_INDOORS_TO_FOREST = "indoors-to-forest";
    const KEY_DESERT_TO_INDOORS_SCUM = "desert-to-indoors-scum";

    const TERRAIN_FILL = {
        "forest": "green",
        "desert-indoors": "tan",
        "desert": "tan",
        "indoors": "purple",
        "indoors-scum": "#aaa"
    }

    export function renderSpace(
        ctx: CanvasRenderingContext2D,
        space: Game.Space) {

        let size = ctx.canvas.width;

        // For lines to layer correctly, has to be two passes: background then lines on top
        drawSpaceBackground(size, ctx, space);
        drawSpaceEdge(ctx, 0, 0, size, 0, space.top);
        drawSpaceEdge(ctx, 0, 0, 0, size, space.left);
        drawSpaceEdge(ctx, 0, size, size, size, space.bottom);
        drawSpaceEdge(ctx, size, 0, size, size, space.right);
        if (space.deploymentZoneColor !== null) {
            drawDeploymentZone(ctx, size, space.deploymentZoneColor!);
        }
    }

    function drawSpaceBackground(
        size: number,
        ctx: CanvasRenderingContext2D,
        space: App.Game.Space) {

        switch (space.terrain) {
            case KEY_INDOORS_TO_FOREST:
                ctx.fillStyle = createIndoorsToForest(ctx, size, space.rotation);
                break;
            case KEY_DESERT_TO_INDOORS_SCUM:
                ctx.fillStyle = createDesertToIndoorsScum(ctx, size, space.rotation);
                break;
            default:
                ctx.fillStyle = TERRAIN_FILL[space.terrain];
                break;
        }

        ctx.strokeStyle = "grey";

        // Space background
        ctx.fillRect(0, 0, size, size);

        // Space Edge
        let edge = 1;
        ctx.lineWidth = edge;
        ctx.setLineDash([]);
        ctx.rect((edge / 2), (edge / 2), size, size);
        ctx.stroke();
    }

    function drawSpaceEdge(
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        border: Game.Border) {

        if (!border) {
            return;
        }

        ctx.strokeStyle = BORDER_STYLE[border];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.setLineDash(BORDER_DASH[border]);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function drawDeploymentZone(ctx: CanvasRenderingContext2D, size: number, color: string) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, size, size);
        ctx.globalAlpha = 1;
    }

    function createDesertToIndoorsScum(ctx: CanvasRenderingContext2D, size: number, rotation: number) {

        let clrStop0: string;
        let clrStop1: string;
        let desert = TERRAIN_FILL["desert"];
        let indoorScum = TERRAIN_FILL["indoors-scum"];
        let w = 0;
        let h = 0;

        switch (rotation) {
            case 0:
                w = size;
                clrStop0 = indoorScum;
                clrStop1 = desert;
                break;
            case 90:
                h = size;
                clrStop0 = indoorScum;
                clrStop1 = desert;
                break;
            case 180:
                w = size;
                clrStop0 = desert;
                clrStop1 = indoorScum;
                break;
            case 270:
                h = size;
                clrStop0 = desert;
                clrStop1 = indoorScum;
                break;
            default:
                throw new Error(`Unsupported rotation: ${rotation}`);
        }

        let grd = ctx.createLinearGradient(0, 0, w, h);
        grd.addColorStop(0, clrStop0);
        grd.addColorStop(1, clrStop1);

        return grd;
    }

    function createIndoorsToForest(ctx: CanvasRenderingContext2D, size: number, rotation: number) {

        let clrStop0: string;
        let clrStop1: string;
        let indoors = TERRAIN_FILL["indoors"];
        let forest = TERRAIN_FILL["forest"];
        let w = 0;
        let h = 0;

        switch (rotation) {
            case 0:
                w = size;
                clrStop0 = forest;
                clrStop1 = indoors;
                break;
            case 90:
                h = size;
                clrStop0 = forest;
                clrStop1 = indoors;
                break;
            case 180:
                w = size;
                clrStop0 = indoors;
                clrStop1 = forest;
                break;
            case 270:
                h = size;
                clrStop0 = indoors;
                clrStop1 = forest;
                break;
            default:
                throw new Error(`Unsupported rotation: ${rotation}`);
        }

        let grd = ctx.createLinearGradient(0, 0, w, h);
        grd.addColorStop(0, clrStop0);
        grd.addColorStop(1, clrStop1);
        return grd;
    }
}