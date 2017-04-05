namespace App.Game.Engine {

    export interface ILosLine {
        fromX: number;
        fromY: number;
        toX: number;
        toY: number;
    }

    export interface ILosResult extends IResult {
        lines?: Array<ILosLine>;
    }
}