/// <references path="util/SpaceRenderer.ts"/>

namespace App.Ng {

    interface IScope {
        $watch: Function;
        space: SkirmishPlayer.UiSpace;
        rctx: RenderingContext;
    }

    export class SpaceDirective {

        public static readonly NAME = "spaceRender";
        public static readonly RESTRICT = "A";
        public static readonly ISOLATE_SCOPE = {
            space: "=",
            rctx: "=",

        };

        private readonly ctx: CanvasRenderingContext2D;
        private readonly uiSpace: SkirmishPlayer.UiSpace;
        private readonly state: Game.Engine.GameState;

        constructor($scope: IScope, $element, $attr) {
            let canvas = <HTMLCanvasElement>$element[0];
            this.ctx = canvas.getContext("2d") !;
            this.uiSpace = $scope.space;

            let boundRender = this.render.bind(this);

            $scope.$watch('space.points', boundRender);
        }

        render() {
            let w = this.ctx.canvas.width;
            let h = this.ctx.canvas.height;

            this.ctx.clearRect(0, 0, w, h);
            Util.SpaceRenderer.renderSpace(this.ctx, this.uiSpace.space);
            if (this.uiSpace.points !== null) {
                this.renderSpaceCost(w);
            }
        }

        private renderSpaceCost(size: number) {

            this.ctx.strokeStyle = "black";
            this.ctx.setLineDash([]);
            this.ctx.lineWidth = 1;
            this.ctx.textAlign = "center";

            let r = size / 2;
            this.ctx.strokeText(`${this.uiSpace.points}`, r, r);
        }
    }
}

App.Ng.module.directive(App.Ng.SpaceDirective.NAME, function () {
    return {
        restrict: App.Ng.SpaceDirective.RESTRICT,
        scope: App.Ng.SpaceDirective.ISOLATE_SCOPE,
        link: function ($scope, $element, $attr) {
            new App.Ng.SpaceDirective($scope, $element, $attr);
        }
    };
});