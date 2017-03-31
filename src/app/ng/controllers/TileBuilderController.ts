/// <reference path="../modules/App.ts"/>

namespace App.Ng {


    export class TileBuilderController {

        public static readonly NAME = "tileBuilderController";
        public static readonly PATH = "/tile-builder";
        public static readonly HTML_NAME = "tile-builder";

        private readonly $scope: TileBuilderController.IScope;
        private selectedLocations: [string, TileBuilderController.Space];

        constructor($scope: TileBuilderController.IScope) {

            this.selectedLocations = <[string, TileBuilderController.Space]>{};

            this.$scope = $scope;
            this.$scope.sideValues = ["", "wall", "blocking_terrain", "difficult_terrain", "impassable_terrain"];
            this.$scope.sideKeys = ["top", "left", "bottom", "right"];
            this.$scope.colCount = 4;
            this.$scope.rowCount = 4;
            this.$scope.toggleSpace = this.toggleSpace.bind(this);
            this.$scope.isSelected = this.isSelected.bind(this);
            this.$scope.export = this.export.bind(this);
            this.$scope.selectSide = this.selectSide.bind(this);
        }

        private isSelected(x: number, y: number) {
            let key = `${x},${y}`;
            return key in this.selectedLocations;
        }

        private toggleSpace(x: number, y: number) {
            let key = `${x},${y}`;
            if (key in this.selectedLocations) {
                delete this.selectedLocations[key];
            } else {
                this.selectedLocations[key] = new TileBuilderController.Space(x, y);
                this.$scope.selectedKey = key;
            }
            delete this.$scope.top;
            delete this.$scope.left;
            delete this.$scope.bottom;
            delete this.$scope.right;
        }

        private selectSide() {
            let space = <TileBuilderController.Space>this.selectedLocations[this.$scope.selectedKey];
            space.top = this.$scope.top;
            space.left = this.$scope.left;
            space.bottom = this.$scope.bottom;
            space.right = this.$scope.right;
        }

        private export() {
            let map = new Array<TileBuilderController.Space>();
            for (let key in this.selectedLocations) {
                let data = <TileBuilderController.Space>this.selectedLocations[key];
                let space = {
                    "x": data.x,
                    "y": data.y
                };
                if (data.top) {
                    space["top"] = data.top;
                }
                if (data.left) {
                    space["left"] = data.left;
                }
                if (data.bottom) {
                    space["bottom"] = data.bottom;
                }
                if (data.right) {
                    space["right"] = data.right;
                }
                map.push(space);
            }
            this.$scope.tileJson = JSON.stringify({ "spaces": map });
        }
    }

    export module TileBuilderController {
        export interface IScope {
            colCount: number;
            rowCount: number;
            selectedKey: string;
            sideKeys: Array<string>;
            sideValues: Array<string>;
            tileJson: string;
            top: string;
            left: string;
            bottom: string;
            right: string;
            isSelected(x: number, y);
            toggleSpace(x: number, y: number);
            selectSide();
            export();
        }

        export class Space {
            x: number;
            y: number;
            top?: string;
            left?: string;
            bottom?: string;
            right?: string;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
            }
        }
    }
}

App.Ng.module.controller(App.Ng.TileBuilderController.NAME,
    [
        '$scope',
        App.Ng.TileBuilderController
    ]
);