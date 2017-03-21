/// <reference path="../modules/App.ts"/>
/// <reference path="../services/ArmyLoader.ts"/>
/// <reference path="../services/SkirmishLoader.ts"/>
/// <reference path="../services/RenderingContext.ts"/>

namespace App.Ng {

    interface IRouteParams {
        skirmish_id: string,
        red: string;
        blue: string;
        initiative: string;
    }

    interface IScope {

        units: Array<Game.Unit>;
        spaces: Array<SkirmishPlayer.UiSpace>;
        state: Game.Engine.GameState;
        rCtx: RenderingContext;

        // Mouse events
        selectUnit: Function;
        exaust: Function;
        performAction: Function;
        selectSpace: Function;

        $apply: Function;
    };

    /**
     * Receives UI Events and interprets them into Game Actions.
     * Renders game state.
     * 
     * 
     */
    export class SkirmishPlayerController implements App.Ng.ISkirmishLoadListener, App.Ng.IArmyLoadListener {

        public static readonly NAME = "skirmishPlayerController";

        private readonly $scope: IScope;
        private readonly renderCtx: Ng.RenderingContext;
        private readonly state: Game.Engine.GameState;
        private engine: App.Game.Engine.GameEngine;

        constructor(
            $scope: IScope,
            $routeParams: IRouteParams,
            skirmishLoader: App.Ng.SkirmishLoader,
            armyLoader: App.Ng.ArmyLoader,
            renderingContext: Ng.RenderingContext) {

            this.state = new Game.Engine.GameState();

            skirmishLoader.load($routeParams.skirmish_id, this);
            armyLoader.load(parseInt($routeParams.blue), "blue", this);
            armyLoader.load(parseInt($routeParams.red), "red", this);

            this.renderCtx = renderingContext;
            this.$scope = $scope;
            this.$scope.rCtx = renderingContext;
            this.$scope.units = new Array<Game.Unit>();
            this.$scope.state = this.state;
            this.$scope.spaces = new Array<SkirmishPlayer.UiSpace>();

            this.$scope.selectUnit = this.selectUnit.bind(this);
            this.$scope.exaust = this.exaust.bind(this);
            this.$scope.performAction = this.performAction.bind(this);
            this.$scope.selectSpace = this.selectSpace.bind(this);

            // TODO: remove
            (<any>window).playerScope = $scope;
        }

        exaust(unit: Game.Unit) {
            let result = this.engine.exaust(unit);
            if (result.success) {
                this.clearMovementPoints();
            } else {
                console.log(result);
            }
        }

        performAction(unit: Game.Unit, action: Model.IAbility) {
            let result = this.engine.performAction(unit, action);
            if (!result.success) {
                console.log(result);
                return;
            }
            this.updateMovementPoints(unit);
        }

        selectSpace(uiSpace: SkirmishPlayer.UiSpace) {
            if (uiSpace.points === null) {
                // Nothing to do 
                return;
            }

            if (this.state.activeGroup === null) {
                return;
            }

            let unit = this.state.activeGroup.activeUnit;
            if (unit === null) {
                return;
            }

            let result = this.engine.move(unit, this.findPath(unit, uiSpace));

            if (!result.success) {
                console.error(result.message);
                return;
            }

            this.clearMovementPoints();
            this.updateMovementPoints(unit);
        }

        onSkirmishLoad(skirmish: App.Game.Skirmish) {
            this.state.skirmish = skirmish;
            for (let gameSpace of skirmish.spaces) {
                this.$scope.spaces.push(new SkirmishPlayer.UiSpace(gameSpace));
            }
            for (let space of this.$scope.spaces) {
                space.populateNeighbors(skirmish.spaces, this.$scope.spaces);
            }
            this.attemptStartEngine();
        }

        onArmyLoad(army: App.Game.Army) {
            this.$scope.units = this.$scope.units.concat(army.units);
            this.state.armies.push(army);
            this.attemptStartEngine();
        }

        private selectUnit(unit:Game.Unit) {
            
            if(this.state.activeGroup === null) {
                this.activate(unit);
                return;
            }

            console.log(unit);
        }

        private activate(unit: Game.Unit) {
            let result = this.engine.activate(unit);
            if (!result.success) {
                console.log(result);
                return;
            }
            this.updateMovementPoints(unit);
        }

        private updateMovementPoints(unit: Game.Unit) {
            if (unit.movementPoints === 0) {
                return;
            }
            let space = SkirmishPlayer.UiUtils.findSpace(unit.x, unit.y, this.$scope.spaces) !;
            space.points = unit.movementPoints;
        }

        private clearMovementPoints() {
            for (let space of this.$scope.spaces) {
                space.points = null;
            }
        }

        private attemptStartEngine() {

            if (!this.state.skirmish ||
                this.state.skirmish.deploymentZones.length !== this.state.armies.length) {
                // Either skirmish not loaded, or all armies are not loaded
                return;
            }

            this.engine = new Game.Engine.GameEngine(this.state);
            this.$scope.$apply();
        }

        private findPath(unit: Game.Unit, uiSpace: SkirmishPlayer.UiSpace): Array<Game.Space> {

            let path = new Array<Game.Space>();
            path.push(uiSpace.space);

            for (let points = uiSpace.points + 1; points < unit.movementPoints; points++) {
                for (let neighbor of uiSpace.neighbors) {
                    if (neighbor.points === points) {
                        uiSpace = neighbor;
                        path.push(uiSpace.space);
                        break;
                    }
                }
            }

            return path.reverse();
        }
    }
}

App.Ng.module.controller(App.Ng.SkirmishPlayerController.NAME,
    [
        '$scope',
        '$routeParams',
        App.Ng.SkirmishLoader.NAME,
        App.Ng.ArmyLoader.NAME,
        App.Ng.RenderingContext.NAME,
        App.Ng.SkirmishPlayerController
    ]
);

App.Ng.module.component('skirmishPlayer', {
    templateUrl: 'assets/html/component/skirmish-player.html',
    controller: App.Ng.SkirmishPlayerController.NAME
});