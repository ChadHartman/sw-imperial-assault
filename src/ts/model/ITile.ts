namespace App.Model {

    export interface ISpace {
        readonly bottom: string;
        readonly left: string;
        readonly right: string;
        readonly top: string;
        readonly x: number;
        readonly y: number;
    }

    export interface ITile {
        id: string;
        readonly terrain: string;
        readonly spaces: Array<ISpace>;
    }
}