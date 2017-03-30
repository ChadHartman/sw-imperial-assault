/// <reference path="SkirmishLoader.ts"/>
/// <reference path="ArmyLoader.ts"/>
/// <reference path="StateCache.ts"/>

namespace App.Ng {

    export interface IEngineListener {
        onGameEngineReady(gameEngine: Game.Engine.GameEngine);
    }

    class ComponentLoader implements App.Ng.ISkirmishLoadListener, App.Ng.IArmyLoadListener {

        private readonly initiative: Game.ZoneColor;
        private readonly armies: Array<Game.Army>;
        private readonly stateCache: StateCache;
        private readonly stateId: number | null;
        private readonly listener: IEngineListener;
        private skirmish: Game.Skirmish;

        constructor(
            initiative: Game.ZoneColor,
            stateId: number | null,
            stateCache: StateCache,
            listener: IEngineListener) {

            this.stateCache = stateCache;
            this.initiative = initiative;
            this.armies = new Array<Game.Army>();
            this.stateId = stateId;
            this.listener = listener;
        }

        onSkirmishLoad(skirmish: App.Game.Skirmish) {
            this.skirmish = skirmish;
            this.check();
        }

        onArmyLoad(army: App.Game.Army) {
            this.armies.push(army);
            this.check();
        }

        private check() {

            if (!this.skirmish ||
                this.skirmish.deploymentZones.length !== this.armies.length) {
                // Either skirmish not loaded, or all armies are not loaded
                return;
            }

            let gameState = new Game.Engine.GameState(this.skirmish, this.armies, this.initiative);
            let engine = new Game.Engine.GameEngine(gameState);
            if (this.stateId !== null) {
                this.stateCache.load(this.stateId, gameState);
            }

            this.listener.onGameEngineReady(engine);
        }
    }

    export class EngineLoader {

        public static readonly NAME = "engineLoader";

        private readonly skirmishLoader: SkirmishLoader;
        private readonly armyLoader: ArmyLoader;
        private readonly stateCache: StateCache;

        constructor(skirmishLoader: SkirmishLoader, armyLoader: ArmyLoader, stateCache: StateCache) {
            this.skirmishLoader = skirmishLoader;
            this.armyLoader = armyLoader;
            this.stateCache = stateCache;
        }

        public load(
            skirmishId: string,
            blueId: number,
            redId: number,
            initiative: Game.ZoneColor,
            stateId: number | null,
            listener: IEngineListener) {

            let loader = new ComponentLoader(initiative, stateId, this.stateCache, listener);
            this.skirmishLoader.load(skirmishId, loader);
            this.armyLoader.load(blueId, Game.ZoneColor.BLUE, loader);
            this.armyLoader.load(redId, Game.ZoneColor.RED, loader);
        }
    }
}
App.Ng.module.factory(App.Ng.EngineLoader.NAME, [
    App.Ng.SkirmishLoader.NAME,
    App.Ng.ArmyLoader.NAME,
    App.Ng.StateCache.NAME,
    function (
        skirmishLoader: App.Ng.SkirmishLoader,
        armyLoader: App.Ng.ArmyLoader,
        stateCache: App.Ng.StateCache) {
        return new App.Ng.EngineLoader(skirmishLoader, armyLoader, stateCache);
    }]
);