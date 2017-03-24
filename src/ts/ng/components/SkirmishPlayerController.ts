/// <reference path="../modules/App.ts"/>
/// <reference path="../services/ArmyLoader.ts"/>
/// <reference path="../services/SkirmishLoader.ts"/>
/// <reference path="../services/RenderingContext.ts"/>
/// <reference path="../services/StateCache.ts"/>

namespace App.Ng {

    enum UiState {
        ACTIVATION,
        TARGETING
    }

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
        $on: Function;
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
        private readonly gameState: Game.Engine.GameState;
        private readonly stateCache: StateCache;
        private readonly $timeout: Function;
        private uiState: UiState;
        private engine: App.Game.Engine.GameEngine;

        constructor(
            $scope: IScope,
            $routeParams: IRouteParams,
            $timeout: Function,
            skirmishLoader: SkirmishLoader,
            armyLoader: ArmyLoader,
            renderingContext: RenderingContext,
            stateCache: StateCache) {

            this.gameState = new Game.Engine.GameState();

            skirmishLoader.load($routeParams.skirmish_id, this);
            armyLoader.load(parseInt($routeParams.blue), "blue", this);
            armyLoader.load(parseInt($routeParams.red), "red", this);

            this.$timeout = $timeout;

            this.renderCtx = renderingContext;
            this.$scope = $scope;
            this.$scope.rCtx = renderingContext;
            this.$scope.units = new Array<Game.Unit>();
            this.$scope.state = this.gameState;
            this.$scope.spaces = new Array<SkirmishPlayer.UiSpace>();

            this.$scope.selectUnit = this.selectUnit.bind(this);
            this.$scope.exaust = this.exaust.bind(this);
            this.$scope.performAction = this.performAction.bind(this);
            this.$scope.selectSpace = this.selectSpace.bind(this);
            this.$scope.$on(SkirmishController.EVENT_SAVE_STATE, this.saveState.bind(this));

            this.uiState = UiState.ACTIVATION;

            this.stateCache = stateCache;

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

            if (action.targets.length === 1 &&
                action.targets[0] === Game.Ability.Target.SELF) {

                let targets = [new Game.Engine.UnitTarget(unit)];
                let result = this.engine.performAction(unit, action, targets);
                if (!result.success) {
                    console.log(result);
                    return;
                }
                this.updateMovementPoints(unit);
            }

            // TODO: change to target selection mode

        }

        selectSpace(uiSpace: SkirmishPlayer.UiSpace) {
            if (uiSpace.points === null) {
                // Nothing to do 
                return;
            }

            if (this.gameState.activeGroup === null) {
                return;
            }

            let unit = this.gameState.activeGroup.activeUnit;
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
            this.gameState.skirmish = skirmish;
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
            this.gameState.armies.push(army);
            this.attemptStartEngine();
        }

        private saveState() {
            this.stateCache.save(this.gameState);
        }

        private selectUnit(unit: Game.Unit) {

            if (this.gameState.activeGroup === null) {
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

            if (!this.gameState.skirmish ||
                this.gameState.skirmish.deploymentZones.length !== this.gameState.armies.length) {
                // Either skirmish not loaded, or all armies are not loaded
                return;
            }

            this.engine = new Game.Engine.GameEngine(this.gameState);
            this.$timeout(angular.noop);
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
        '$timeout',
        App.Ng.SkirmishLoader.NAME,
        App.Ng.ArmyLoader.NAME,
        App.Ng.RenderingContext.NAME,
        App.Ng.StateCache.NAME,
        App.Ng.SkirmishPlayerController
    ]
);

App.Ng.module.component('skirmishPlayer', {
    templateUrl: 'assets/html/component/skirmish-player.html',
    controller: App.Ng.SkirmishPlayerController.NAME
});