/// <reference path="../modules/App.ts"/>
/// <reference path="../services/EngineLoader.ts"/>
/// <reference path="../services/RenderingContext.ts"/>
/// <reference path="../services/StateCache.ts"/>

namespace App.Ng {

    enum UiState {
        ACTIVATION,
        TARGETING
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

    interface IRouteParams {
        skirmish_id: string,
        state?: string;
        red: string;
        blue: string;
        initiative: string;
    }

    /**
     * Receives UI Events and interprets them into Game Actions.
     * Renders game state.
     * 
     * 
     */
    export class SkirmishPlayerController implements IEngineListener {

        public static readonly NAME = "skirmishPlayerController";

        private readonly $scope: IScope;
        private readonly renderCtx: Ng.RenderingContext;
        private readonly $timeout: Function;
        private readonly stateCache: StateCache;
        private uiState: UiState;
        private engine: App.Game.Engine.GameEngine;

        constructor(
            $scope: IScope,
            $routeParams,
            $timeout: Function,
            engineLoader: EngineLoader,
            renderingContext: RenderingContext,
            stateCache: StateCache) {

            engineLoader.load(
                $routeParams.skirmish_id,
                parseInt($routeParams.blue),
                parseInt($routeParams.red),
                Game.toZoneColor($routeParams.initiative),
                ($routeParams.state ? parseInt($routeParams.state) : null),
                this);

            this.stateCache = stateCache;
            this.$timeout = $timeout;

            this.renderCtx = renderingContext;
            this.$scope = $scope;
            this.$scope.rCtx = renderingContext;
            this.$scope.units = new Array<Game.Unit>();
            this.$scope.spaces = new Array<SkirmishPlayer.UiSpace>();

            this.$scope.selectUnit = this.selectUnit.bind(this);
            this.$scope.exaust = this.exaust.bind(this);
            this.$scope.performAction = this.performAction.bind(this);
            this.$scope.selectSpace = this.selectSpace.bind(this);
            this.$scope.$on(SkirmishController.EVENT_SAVE_STATE, this.saveState.bind(this));

            this.uiState = UiState.ACTIVATION;

            // TODO: remove
            (<any>window).playerScope = $scope;
        }

        exaust(unit: Game.Unit) {
            let result = this.engine.exaust(unit);
            if (result.success) {
                this.updateMovementPoints();
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
                this.updateMovementPoints();
            }

            // TODO: change to target selection mode

        }

        selectSpace(uiSpace: SkirmishPlayer.UiSpace) {

            if (uiSpace.points === null) {
                // Nothing to do 
                return;
            }

            let unit = this.engine.state.activeUnit;
            if (unit === null) {
                return;
            }

            let result = this.engine.move(unit, this.findPath(unit, uiSpace));

            if (!result.success) {
                console.error(result.message);
                return;
            }

            this.updateMovementPoints();
        }

        onGameEngineReady(engine: Game.Engine.GameEngine) {

            this.engine = engine;
            this.$scope.state = engine.state;

            for (let gameSpace of this.engine.state.skirmish.spaces) {
                this.$scope.spaces.push(new SkirmishPlayer.UiSpace(gameSpace));
            }

            for (let space of this.$scope.spaces) {
                space.populateNeighbors(engine.state.skirmish.spaces, this.$scope.spaces);
            }

            for (let army of this.engine.state.armies) {
                this.$scope.units = this.$scope.units.concat(army.units);
            }

            this.updateMovementPoints();

            // Refresh view state
            this.$timeout(angular.noop);
        }

        private saveState() {
            this.stateCache.save(this.engine.state);
        }

        private selectUnit(unit: Game.Unit) {

            if (this.engine.state.activeUnit === null) {
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
            this.updateMovementPoints();
        }

        private updateMovementPoints() {

            for (let space of this.$scope.spaces) {
                space.points = null;
            }

            let unit = this.engine.state.activeUnit;
            if (unit === null) {
                return;
            }

            let space = SkirmishPlayer.UiUtils.findSpace(unit.x, unit.y, this.$scope.spaces) !;
            space.points = unit.movementPoints;
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
        App.Ng.EngineLoader.NAME,
        App.Ng.RenderingContext.NAME,
        App.Ng.StateCache.NAME,
        App.Ng.SkirmishPlayerController
    ]
);

App.Ng.module.component('skirmishPlayer', {
    templateUrl: 'assets/html/component/skirmish-player.html',
    controller: App.Ng.SkirmishPlayerController.NAME
});