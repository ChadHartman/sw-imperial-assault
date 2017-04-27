/// <reference path="../modules/App.ts"/>
/// <reference path="../services/EngineLoader.ts"/>
/// <reference path="../services/RenderingContext.ts"/>
/// <reference path="../services/StateCache.ts"/>

namespace App.Ng {

    /**
     * Receives UI Events and interprets them into Game Actions.
     * Renders game state.
     * 
     * 
     */
    export class SkirmishPlayerController implements IEngineListener {

        public static readonly NAME = "skirmishPlayerController";

        private engine: App.Game.Engine.GameEngine;

        constructor(
            private readonly $scope: SkirmishPlayerController.IScope,
            $routeParams,
            private readonly $timeout: Function,
            engineLoader: EngineLoader,
            private readonly renderCtx: RenderingContext,
            private readonly stateCache: StateCache) {

            engineLoader.load(
                $routeParams.skirmish_id,
                parseInt($routeParams.blue),
                parseInt($routeParams.red),
                Game.toZoneColor($routeParams.initiative),
                ($routeParams.state ? parseInt($routeParams.state) : null),
                this);

            this.stateCache = stateCache;
            this.$timeout = $timeout;

            this.$scope = $scope;
            this.$scope.rCtx = this.renderCtx;
            this.$scope.units = new Array<Game.Unit>();
            this.$scope.targetableUnits = new Array<Game.Unit>();
            this.$scope.spaces = new Array<SkirmishPlayer.UiSpace>();

            this.$scope.attackMenuVisible = this.attackMenuVisible.bind(this);
            this.$scope.selectUnit = this.selectUnit.bind(this);
            this.$scope.exaust = this.exaust.bind(this);
            this.$scope.attack = this.attack.bind(this);
            this.$scope.cancelAttack = this.cancelAttack.bind(this);
            this.$scope.move = this.move.bind(this);
            this.$scope.selectSpace = this.selectSpace.bind(this);
            this.$scope.$on(SkirmishController.EVENT_SAVE_STATE, this.saveState.bind(this));
            this.$scope.$on(AttackController.EVENT_ATTACK_COMPLETE, this.onAttackComplete.bind(this));
            this.$scope.attackCtx = null;
            this.$scope.isTargetable = this.isTargetable.bind(this);

            App.debug["skirmishPlayerScope"] = $scope;
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

        private onAttackComplete(name: string, ...args: any[]) {
            this.$scope.attackCtx = null;
        }

        private exaust(unit: Game.Unit) {
            let result = this.engine.exaust(unit);
            if (result.success) {
                this.updateMovementPoints();
            } else {
                console.log(result);
            }
        }

        private cancelAttack() {
            this.$scope.attackCtx = null;
            this.$scope.targetableUnits = new Array<Game.Unit>();
        }

        private attack(unit: Game.Unit) {

            if (this.$scope.attackCtx !== null) {
                console.error("Already performing an attack");
                return;
            }

            let ctx = this.engine.beginAttack(unit);
            this.$scope.attackCtx = ctx;

            for (let unit of this.$scope.units) {
                if (ctx.targetable(unit)) {
                    this.$scope.targetableUnits.push(unit);
                }
            }

            this.$scope.$broadcast(AttackController.EVENT_ATTACK_BEGIN, ctx);
        }

        private isTargetable(unit: Game.Unit): boolean {
            for (let targetable of this.$scope.targetableUnits) {
                if (unit.uniqueId === targetable.uniqueId) {
                    return true;
                }
            }
            return false;
        }

        private move(unit: Game.Unit) {
            unit.movementPoints += unit.deployment.speed;
            this.updateMovementPoints();
        }

        private saveState() {
            this.stateCache.save(this.engine.state);
        }

        private selectUnit(unit: Game.Unit) {

            if (this.engine.state.activeUnit === null) {
                this.activate(unit);
                return;
            }

            if (this.$scope.attackCtx !== null) {

                let ctx = this.$scope.attackCtx;

                if (ctx.target !== null) {
                    console.error(`Already targeting ${ctx.target!.uniqueId}`);
                    return;
                }

                if (!ctx.targetable(unit)) {
                    console.error(`Cannot target ${unit.uniqueId}`);
                    return;
                }

                ctx.target = unit;
                this.$scope.targetableUnits = new Array<Game.Unit>();

                return;
            }

            console.log(`Doing nothing with ${unit.uniqueId}`);
        }

        private selectSpace(uiSpace: SkirmishPlayer.UiSpace) {

            if (this.$scope.attackCtx !== null) {
                return;
            }

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

        private attackMenuVisible(): boolean {
            return this.$scope.attackCtx !== null &&
                this.$scope.attackCtx.target !== null;
        }
    }

    export module SkirmishPlayerController {

        export interface IScope {

            units: Array<Game.Unit>;
            targetableUnits: Array<Game.Unit>;
            spaces: Array<SkirmishPlayer.UiSpace>;
            state: Game.Engine.GameState;
            rCtx: RenderingContext;
            attackCtx: Game.Attack.BaseAttack | null;
            isTargetable: (unit: Game.Unit) => boolean;
            attackMenuVisible: () => boolean;
            $broadcast: (name: string, ...args: any[]) => void;

            // Mouse events
            attack: (unit: Game.Unit) => void;
            move: (unit: Game.Unit) => void;
            cancelAttack: () => void;
            selectUnit: Function;
            exaust: Function;
            performAction: Function;
            selectSpace: Function;

            $apply: Function;
            $on: (name: string, callback: (name: string, ...args: any[]) => void) => void;
        }

        export interface IRouteParams {
            skirmish_id: string,
            state?: string;
            red: string;
            blue: string;
            initiative: string;
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