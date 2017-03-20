/// <reference path="../modules/App.ts"/>

namespace App.Ng {

    const DEFAULT_SIZE = 40;
    const DEFAULT_MARGIN = 32;
    const DEFAULT_DEPLOYMENT_MARGIN = 4;

    export class RenderingContext {

        public static readonly NAME = "renderContext";
        public readonly deploymentMargin: number;
        public readonly margin: number;
        private _selectedSize: number;
        private _size: number;
        private _radius: number;

        constructor() {
            this.deploymentMargin = DEFAULT_DEPLOYMENT_MARGIN;
            this.margin = DEFAULT_MARGIN;
            this.size = DEFAULT_SIZE
        }

        public get selectedSize() {
            return this._selectedSize;
        }

        public get size() {
            return this._size;
        }

        public set size(value: number) {
            this._size = value;
            this._radius = value / 2;
            this._selectedSize = value * 1.1;
        }

        public get radius() {
            return this._radius;
        }

        public left(x: number) {
            return this.margin + (this._size * x);
        }

        public top(y: number) {
            return this.margin + (this._size * y);
        }

        public right(x: number) {
            return this.margin + (this._size * (x + 1));
        }

        public bottom(y: number) {
            return this.margin + (this._size * (y + 1));
        }

    }
}

App.Ng.module.factory(App.Ng.RenderingContext.NAME, [
    function () {
        return new App.Ng.RenderingContext();
    }]
);