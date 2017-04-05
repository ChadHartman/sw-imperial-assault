namespace App.Ng {

    const TWO_PI = Math.PI * 2;
    const HALF_PI = Math.PI / 2;
    const BORDER_SIZE = 5;

    export class UnitDirective {

        public static readonly NAME = "unitRender";
        public static readonly RESTRICT = "A";
        public static readonly ISOLATE_SCOPE = {
            unit: '=',
            targetable: '='
        };

        private readonly unit: Game.Unit;
        private readonly ctx: CanvasRenderingContext2D;
        private readonly classColor: string;
        private targeted: boolean;

        constructor($scope: UnitDirective.IScope, $element) {
            let canvas = <HTMLCanvasElement>$element[0];
            this.ctx = canvas.getContext("2d") !;
            this.unit = $scope.unit;
            this.targeted = false;

            switch ($scope.unit.deployment.rank) {
                case Game.Unit.CLASS_ELITE:
                    this.classColor = "red";
                    break;
                case Game.Unit.CLASS_REGULAR:
                    this.classColor = "grey";
                    break;
                default:
                    throw new Error(`Unsupported unit class: ${$scope.unit.deployment.rank}`);
            }

            $scope.$watch("unit.health", this.render.bind(this));
            $scope.$watch("targetable", this.checkTargetable.bind(this));
        }

        private checkTargetable(newValue: Array<Game.Unit> | undefined, oldValue: Array<Game.Unit> | undefined) {
            if (newValue) {
                this.targeted = newValue.indexOf(this.unit) !== -1;
            } else {
                this.targeted = false;
            }
            this.render();
        }

        private render(/*newValue, oldValue*/) {

            let w = this.ctx.canvas.width;
            let h = this.ctx.canvas.height;

            this.ctx.clearRect(0, 0, w, h);
            this.drawBase(w, h);
            this.drawImage(w, h);
            this.drawHealth(w, h);
            this.drawAffiliation(w, h);
            if (this.targeted) {
                this.drawTarget(w, h);
            }
        }

        private drawBase(w: number, h: number) {
            let r = w / 2;
            this.ctx.fillStyle = "black";
            this.ctx.beginPath();
            this.ctx.arc(r, r, r, 0, TWO_PI);
            this.ctx.fill();
        }

        private drawImage(w: number, h: number) {
            let size = w - (2 * BORDER_SIZE);
            this.ctx.drawImage(
                this.unit.deployment.image,
                BORDER_SIZE,
                BORDER_SIZE,
                size,
                size);
        }

        private drawHealth(w: number, h: number) {

            let healthAngle = (this.unit.health / this.unit.deployment.health) * TWO_PI;

            // Center of border
            let r = w / 2;
            let healthR = (w / 2) - (BORDER_SIZE / 2);
            this.ctx.strokeStyle = this.classColor;
            // Visible edges
            this.ctx.lineWidth = BORDER_SIZE - 2;
            this.ctx.beginPath();
            this.ctx.arc(r, r, healthR, HALF_PI, healthAngle + HALF_PI);
            this.ctx.stroke();
        }

        private drawAffiliation(w: number, h: number) {
            let r = w / 2;
            let ar = 5;
            this.ctx.fillStyle = Game.ZoneColor[this.unit.zoneColor].toLowerCase();
            this.ctx.beginPath();
            this.ctx.arc(r, h - ar, ar, 0, TWO_PI);
            this.ctx.fill();
        }

        private drawTarget(w: number, h: number) {
            this.ctx.fillStyle = "red";
            this.ctx.font = `${w}px FontAwesome`;
            this.ctx.textAlign = "center";
            let symbol = String.fromCharCode(0xf140);
            this.ctx.fillText(symbol, w / 2, h * .8);
        }
    }

    export module UnitDirective {
        export interface IScope {
            unit: Game.Unit;
            targetable: Array<Game.Unit>;
            $watch: Function;
        }
    }

}

App.Ng.module.directive(App.Ng.UnitDirective.NAME, function () {
    return {
        restrict: App.Ng.UnitDirective.RESTRICT,
        scope: App.Ng.UnitDirective.ISOLATE_SCOPE,
        link: function ($scope, $element, $attr) {
            new App.Ng.UnitDirective($scope, $element);
        }
    };
});