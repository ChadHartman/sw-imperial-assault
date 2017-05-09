declare namespace App {
    const debug: {};
}
declare namespace App.Game.Ability {
    interface LoadListener {
        onAbilityLoad(ability: BaseAbility): any;
    }
    function loaded(ability: BaseAbility): void;
    function ability(id: string, listener: LoadListener): void;
}
declare namespace App.Game.Ability {
    abstract class BaseAbility {
        readonly abstract id: string;
        readonly abstract name: string;
        readonly isAction: boolean;
        readonly isSpecialAction: boolean;
        executable(actor: Unit, ability: BaseAbility, state: Engine.GameState): Engine.ActionExecutable;
    }
}
declare namespace App.Game {
    enum ActivationState {
        READY = 0,
        ACTIVE_WAITING = 1,
        ACTIVE = 2,
        EXAUSTED = 3,
    }
}
declare namespace App.Game {
    class Army {
        readonly id: number;
        readonly title: string;
        readonly units: Array<Unit>;
        readonly groups: Array<Group>;
        readonly zoneColor: ZoneColor;
        constructor(id: number, title: string, zoneColor: ZoneColor, deployments: Array<Deployment>);
    }
}
declare namespace App.Game.Attack {
    interface IAttackResult {
        damage: number;
        status_effects?: Set<StatusEffect> | null;
    }
    interface IAttackDieRoll {
        id: number;
        die: Dice.AttackDie;
        side: Dice.IAttackSide;
        rerolled: boolean;
    }
    interface IDefenseDieRoll {
        id: number;
        die: Dice.DefenseDie;
        side: Dice.IDefenseSide;
        rerolled: boolean;
    }
    enum Phase {
        DECLARE_TARGET = 0,
        REROLLS = 1,
        APPLY_MODIFIERS = 2,
        SPEND_SURGES = 3,
        CALCULATE_DAMAGE = 4,
    }
    abstract class BaseAttack {
        readonly attacker: Unit;
        readonly attackRoll: Array<IAttackDieRoll>;
        readonly defenseRoll: Array<IDefenseDieRoll>;
        protected readonly state: Engine.GameState;
        private readonly modifiers;
        private readonly surges;
        private _target;
        private _phase;
        constructor(attacker: Unit, state: Engine.GameState);
        target: Unit | null;
        reroll(id: number): void;
        applyModifier(modifier: Modifier): void;
        isSurgeSpendable(surge: Surge): boolean;
        spendSurge(surge: Surge): void;
        readonly damage: number;
        readonly surge: number;
        readonly phase: Phase;
        private readonly dodged;
        private readonly accuracy;
        abstract targetable(unit: Unit): boolean;
        protected abstract inRange(accuracy: number): boolean;
        result(): IAttackResult;
    }
}
declare namespace App.Game.Attack {
    class MeleeAttack extends BaseAttack {
        protected inRange(accuracy: number): boolean;
        targetable(defender: Unit): boolean;
    }
}
declare namespace App.Game.Attack {
    class RangedAttack extends BaseAttack {
        protected inRange(accuracy: number): boolean;
        targetable(defender: Unit): boolean;
    }
}
declare namespace App.Game {
    enum Attribute {
        SURGE = 0,
        DAMAGE = 1,
        BLOCK = 2,
        EVADE = 3,
        ACCURACY = 4,
        DODGE = 5,
        STATUS = 6,
        RECOVER = 7,
        PIERCE = 8,
    }
    module Attribute {
        function parse(name: string): Attribute;
    }
}
declare namespace App.Game {
    enum AttackType {
        NONE = 0,
        RANGED = 1,
        MELEE = 2,
    }
    module AttackType {
        function parse(name: String): AttackType;
    }
    class Deployment {
        readonly id: string;
        readonly title: string;
        readonly image: HTMLImageElement;
        readonly abilities: Array<any>;
        readonly groupSize: number;
        readonly speed: number;
        readonly attackType: AttackType;
        readonly attackDice: Array<Dice.AttackDie>;
        readonly defenseDice: Array<string>;
        readonly health: number;
        readonly rank: string;
        readonly surges: Array<Surge>;
        constructor(id: string, image: HTMLImageElement, data: App.Model.IDeployment, abilities: Array<any>);
    }
}
declare namespace App.Game.Dice {
    interface IAttackSide {
        index: number;
        damage: number;
        surge: number;
        range: number;
    }
    class AttackDie {
        readonly name: string;
        private readonly sides;
        constructor(name: string, sides: Array<IAttackSide>);
        roll(): IAttackSide;
    }
    const RED: AttackDie;
    const BLUE: AttackDie;
    const GREEN: AttackDie;
    const YELLOW: AttackDie;
}
declare namespace App.Game.Dice {
    interface IDefenseSide {
        block: number;
        evade: number;
        dodge: number;
        index: number;
    }
    class DefenseDie {
        readonly name: string;
        private readonly sides;
        constructor(name: string, sides: Array<IDefenseSide>);
        roll(): IDefenseSide;
    }
    const BLACK: DefenseDie;
    const WHITE: DefenseDie;
}
declare namespace App.Game.Dice {
    function attackDie(name: string): AttackDie;
    function defenseDie(name: string): DefenseDie;
}
declare namespace App.Game.Engine {
    abstract class ActionExecutable {
        readonly ability: Ability.BaseAbility;
        protected readonly actor: Unit;
        protected readonly state: Engine.GameState;
        constructor(actor: Unit, ability: Ability.BaseAbility, state: Engine.GameState);
        readonly targetableUnits: Unit[];
        readonly targetableSpaces: Space[];
        targetUnit(unit: Unit): boolean;
        targetSpace(space: Space): boolean;
        readonly abstract ready: boolean;
        abstract execute(): Engine.IResult;
    }
}
declare namespace App.Game.Engine {
    class GameEngine {
        readonly state: GameState;
        constructor(gameState: GameState);
        activate(unit: Game.Unit): IResult;
        exaust(unit: Unit): IResult;
        move(unit: Unit, spaces: Array<Space>): IResult;
        beginAttack(actor: Unit): Attack.BaseAttack;
        private deploy();
        private getDeploymentZone(zoneColor);
        private checkRound();
    }
}
declare namespace App.Game.Engine {
    /**
     * Should never mutate itself
     */
    class GameState {
        readonly armies: Array<Army>;
        readonly skirmish: Skirmish;
        readonly initiative: ZoneColor;
        readonly losService: Util.LosService;
        round: number;
        constructor(skirmish: Skirmish, armies: Array<Army>, initiative: ZoneColor);
        readonly activeUnit: Unit | null;
        readonly activeGroup: Group | null;
        unit(id: string): Game.Unit;
        group(zoneColor: ZoneColor, groupId: number): Group;
        space(x: number, y: number): Space | null;
        unitAt(x: number, y: number): Unit | null;
        occupied(x: number, y: number): boolean;
        army(zoneColor: ZoneColor): Army;
        exaustedGroups(zoneColor: ZoneColor): Array<Group>;
        readonly activeZone: ZoneColor;
        los(from: Unit, to: Unit): ILosResult;
        distance(from: Unit, to: Unit): number;
    }
}
declare namespace App.Game.Engine {
    interface IResult {
        success: boolean;
        message?: string;
    }
    const SUCCESS: {
        success: boolean;
    };
    function failure(reason?: string): IResult;
}
declare namespace App.Game.Engine {
    interface ILosLine {
        fromX: number;
        fromY: number;
        toX: number;
        toY: number;
    }
    interface ILosResult extends IResult {
        lines?: Array<ILosLine>;
    }
}
declare namespace App.Game.Engine.Util {
    class LosService {
        private readonly state;
        constructor(state: GameState);
        los(from: Unit, to: Unit): ILosResult;
        private cornerToSpaceLos(x1, y1, to);
        private cornerToCornerLos(x1, y1, x2, y2);
    }
}
declare namespace App.Game.Engine.Util {
    function findSpace(x: number, y: number, spaces: Array<Space>): Space | null;
    function accessible(x1: number, y1: number, x2: number, y2: number, spaces: Array<Space>): boolean;
}
declare namespace App.Game {
    class Group {
        readonly units: Array<Unit>;
        readonly id: number;
        readonly zoneColor: ZoneColor;
        readonly uniqueId: string;
        constructor(id: number, zoneColor: ZoneColor);
        readonly state: ActivationState;
        activate(firstUnitId: number): void;
        ready(): void;
        getUnit(id: number): Unit;
        readonly exausted: boolean;
        readonly active: boolean;
        readonly activeUnit: Unit | null;
    }
}
declare namespace App.Game {
    class Line {
        readonly m: number;
        readonly b: number;
        readonly x1: number;
        readonly y1: number;
        readonly x2: number;
        readonly y2: number;
        private readonly xMin;
        private readonly yMin;
        private readonly xMax;
        private readonly yMax;
        constructor(x1: number, y1: number, x2: number, y2: number);
        interects(line: Line): boolean;
        private inBounds(x, y);
        yGivenX(x: number): number;
        xGivenY(y: number): number;
    }
}
declare namespace App.Game {
    class Modifier {
        readonly type: Attribute;
        readonly value: number | null;
        readonly status: StatusEffect | null;
        private readonly description;
        constructor(data: Model.IModifier);
        private createDescription();
        toString(): string;
    }
}
declare namespace App.Game {
    class Skirmish {
        readonly id: string;
        readonly spaces: Array<Space>;
        readonly deploymentZones: Array<App.Model.IDeploymentZone>;
        constructor(id: string, config: App.Model.ISkirmishConfig, tiles: Array<App.Model.ITile>);
        private createTileTable(tiles);
        private addSpaces(offsetX, offsetY, rotation, tile);
        private getDeploymentZoneColor(x, y);
        private getMax(tile, attribute);
    }
}
declare namespace App.Game {
    enum Border {
        NONE = 0,
        WALL = 1,
        BLOCKING = 2,
        DIFFICULT = 3,
        IMPASSABLE = 4,
    }
    class BorderLines {
        readonly top: Line;
        readonly left: Line;
        readonly bottom: Line;
        readonly right: Line;
        constructor(x: number, y: number);
    }
    class Space {
        readonly top: Border;
        readonly left: Border;
        readonly bottom: Border;
        readonly right: Border;
        readonly terrain: string;
        readonly lines: BorderLines;
        readonly x: number;
        readonly y: number;
        readonly rotation: number;
        readonly deploymentZoneColor: string | null;
        constructor(x: number, y: number, topBorder: string, leftBorder: string, bottomBorder: string, rightBorder: string, rotation: number, terrain: string, deploymentZoneColor: string | null);
        private toBorder(value);
    }
}
declare namespace App.Game {
    enum StatusEffect {
        STUN = 0,
        BLEED = 1,
        WEAKENED = 2,
        FOCUSED = 3,
        HIDDEN = 4,
    }
    module StatusEffect {
        function parse(name: string): StatusEffect;
    }
}
declare namespace App.Game {
    class Surge {
        readonly id: number;
        readonly cost: number;
        readonly modifiers: Array<Modifier>;
        private readonly description;
        constructor(id: number, data: Model.ISurge);
        private createDescription();
        toString(): string;
    }
}
declare namespace App.Game {
    class Unit {
        static readonly CLASS_ELITE: string;
        static readonly CLASS_REGULAR: string;
        readonly id: number;
        readonly groupId: number;
        readonly zoneColor: ZoneColor;
        readonly deployment: Deployment;
        readonly abilities: Array<any>;
        readonly uniqueId: string;
        readonly actions: Array<any>;
        health: number;
        actionCount: number;
        _state: ActivationState;
        movementPoints: number;
        x: number;
        y: number;
        constructor(id: number, groupId: number, zoneColor: ZoneColor, deployment: Deployment);
        state: ActivationState;
        readonly ready: boolean;
        readonly exausted: boolean;
        readonly active: boolean;
        readonly activeWaiting: boolean;
    }
}
declare namespace App.Game {
    enum ZoneColor {
        RED = 0,
        BLUE = 1,
    }
    function toZoneColor(color: string): ZoneColor;
}
declare namespace App.Model {
    interface IArmy {
        readonly id: number;
        readonly title: string;
        readonly deploymentIds: Array<string>;
    }
    interface IArmyCollection {
        __last_id__: number;
        readonly armies: Array<IArmy>;
    }
    function createArmy(title: string, deploymentIds: Array<string>, armyCollection: IArmyCollection): IArmy;
    function createArmyCollection(): IArmyCollection;
}
declare namespace App.Model {
    interface ICoordinate {
        x: number;
        y: number;
    }
}
declare namespace App.Model {
    interface IModifier {
        type: string;
        value?: number;
        status?: string;
    }
    interface ISurge {
        cost: number;
        modifiers: Array<IModifier>;
    }
    interface IAttack {
        type: string;
        dice: Array<string>;
    }
    interface IDeployment {
        title: string;
        rank: string;
        width: number;
        height: number;
        group_size: number;
        deployment_cost: number;
        health: number;
        speed: number;
        attack: IAttack;
        defense: Array<string>;
        abilities: Array<string>;
        surges: Array<ISurge>;
        image_url: string;
    }
}
declare namespace App.Model {
    interface IItemInfo {
        id: string;
        title: string;
    }
}
declare namespace App.Model {
    interface IDeploymentZone {
        color: string;
        spaces: Array<ICoordinate>;
    }
    interface ITileConfig {
        tile_id: string;
        x: number;
        y: number;
        rotation: number;
    }
    interface ISkirmishConfig {
        deployment_zones: Array<IDeploymentZone>;
        tiles: Array<ITileConfig>;
    }
}
declare namespace App.Model {
    interface ISpace {
        readonly bottom: string;
        readonly left: string;
        readonly right: string;
        readonly top: string;
        readonly x: number;
        readonly y: number;
    }
    interface ITile {
        id: string;
        readonly terrain: string;
        readonly spaces: Array<ISpace>;
    }
}
declare let angular: any;
declare namespace App.Ng {
    let module: any;
}
declare namespace App.Ng {
    /**
     * Receives UI Events and interprets them into Game Actions.
     * Renders game state.
     *
     *
     */
    class AttackController {
        private readonly $scope;
        static readonly NAME: string;
        static readonly EVENT_ATTACK_BEGIN: string;
        static readonly EVENT_ATTACK_COMPLETE: string;
        constructor($scope: AttackController.IScope);
        private onAttackBegin(event, ctx);
        private rerollAttackDie(roll);
        private rerollDefenseDie(roll);
        private spendSurge(surge);
        private complete();
    }
    module AttackController {
        interface IScope {
            ctx: Game.Attack.BaseAttack;
            $emit: (name: string, ...args: any[]) => void;
            $on: (name: string, callback: (name: string, ...args: any[]) => void) => void;
            spendSurge: (surge: Model.ISurge) => void;
            rerollAttackDie: (roll: Game.Attack.IAttackDieRoll) => void;
            rerollDefenseDie: (roll: Game.Attack.IDefenseDieRoll) => void;
            complete: () => void;
        }
    }
}
declare namespace App.Ng.SkirmishPlayer {
    /**
     * Container for holding source data and rendering info.
     *
     */
    class UiSpace {
        readonly space: Game.Space;
        readonly neighbors: Array<UiSpace>;
        private _points;
        constructor(space: Game.Space);
        populateNeighbors(spaces: Array<Game.Space>, uiSpaces: Array<UiSpace>): void;
        /**
         * Movement points remaining after entering this space
         *
         */
        points: number | null;
    }
}
declare namespace App.Ng.SkirmishPlayer.UiUtils {
    function findSpace(x: number, y: number, uiSpaces: Array<UiSpace>): UiSpace | null;
}
declare namespace App.Ng {
    interface ISkirmishLoadListener {
        onSkirmishLoad(skirmish: App.Game.Skirmish): any;
    }
    class SkirmishLoader {
        static readonly NAME: string;
        private readonly $http;
        constructor($http: any);
        load(id: string, listener: ISkirmishLoadListener): void;
    }
}
declare namespace App.Ng {
    class AbilityLoader {
        static readonly NAME: string;
        loadRequestListener: AbilityLoader.IRequestListener | null;
        constructor();
        load(id: string): boolean;
    }
    module AbilityLoader {
        interface IRequestListener {
            requestScript(src: string): boolean;
        }
    }
}
declare namespace App.Ng {
    interface IDeploymentLoadListener {
        onDeploymentLoaded(deployment: App.Game.Deployment): any;
    }
    class DeploymentLoader {
        static readonly NAME: string;
        private readonly $http;
        private readonly abilityLoader;
        constructor($http: any, abilityLoader: AbilityLoader);
        load(id: string, listener: IDeploymentLoadListener): void;
    }
}
declare namespace App.Ng {
    /**
     * Managers army persistances
     *
     */
    class ArmyCache {
        static readonly NAME: string;
        private static readonly LS_KEY;
        private readonly armyCollection;
        readonly armies: Array<Model.IArmy>;
        constructor();
        load(id: number): Model.IArmy;
        removeArmy(id: number): void;
        saveArmy(title: string, deploymentIds: Array<string>): void;
        private persistCache();
    }
}
declare namespace App.Ng {
    interface IArmyLoadListener {
        onArmyLoad(army: App.Game.Army): any;
    }
    class ArmyLoader {
        static readonly NAME: string;
        private readonly $http;
        private readonly armyCache;
        private readonly deploymentLoader;
        constructor($http: any, armyCache: ArmyCache, deploymentLoader: DeploymentLoader);
        load(id: number, zoneColor: Game.ZoneColor, listener: IArmyLoadListener): void;
    }
}
declare namespace App.Ng {
    class StateCache {
        static readonly NAME: string;
        private static readonly LS_KEY;
        readonly states: Array<StateCache.ISkirmishState>;
        private readonly stateCollection;
        constructor();
        save(gameState: Game.Engine.GameState): void;
        load(stateId: number, gameState: Game.Engine.GameState): void;
        private getState(id);
        private createUnitState(unit);
        private persistCache();
    }
    module StateCache {
        interface IArmy {
            id: number;
            color: string;
        }
        interface IUnitState {
            unique_id: string;
            movement_points: number;
            x: number;
            y: number;
            state: string;
        }
        interface ISkirmishState {
            id: number;
            skirmish_id: string;
            initiative: string;
            units: Array<IUnitState>;
            round: number;
            red?: number;
            blue?: number;
            timestamp: number;
        }
        interface IStateCollection {
            __last_id__: number;
            readonly states: Array<ISkirmishState>;
        }
    }
}
declare namespace App.Ng {
    interface IEngineListener {
        onGameEngineReady(gameEngine: Game.Engine.GameEngine): any;
    }
    class EngineLoader {
        static readonly NAME: string;
        private readonly skirmishLoader;
        private readonly armyLoader;
        private readonly stateCache;
        constructor(skirmishLoader: SkirmishLoader, armyLoader: ArmyLoader, stateCache: StateCache);
        load(skirmishId: string, blueId: number, redId: number, initiative: Game.ZoneColor, stateId: number | null, listener: IEngineListener): void;
    }
}
declare namespace App.Ng {
    class RenderingContext {
        static readonly NAME: string;
        readonly deploymentMargin: number;
        readonly margin: number;
        private _selectedSize;
        private _size;
        private _radius;
        constructor();
        readonly selectedSize: number;
        size: number;
        readonly radius: number;
        left(x: number): number;
        top(y: number): number;
        right(x: number): number;
        bottom(y: number): number;
    }
}
declare namespace App.Ng {
    /**
     * Receives UI Events and interprets them into Game Actions.
     * Renders game state.
     *
     *
     */
    class SkirmishPlayerController implements IEngineListener {
        private readonly $scope;
        private readonly $timeout;
        private readonly renderCtx;
        private readonly stateCache;
        static readonly NAME: string;
        private engine;
        constructor($scope: SkirmishPlayerController.IScope, $routeParams: any, $timeout: Function, engineLoader: EngineLoader, renderCtx: RenderingContext, stateCache: StateCache);
        onGameEngineReady(engine: Game.Engine.GameEngine): void;
        private onAttackComplete(name, ...args);
        private exaust(unit);
        private cancelAttack();
        private attack(unit);
        private isTargetable(unit);
        private move(unit);
        private saveState();
        private selectUnit(unit);
        private selectSpace(uiSpace);
        private activate(unit);
        private updateMovementPoints();
        private findPath(unit, uiSpace);
        private attackMenuVisible();
    }
    module SkirmishPlayerController {
        interface IScope {
            units: Array<Game.Unit>;
            targetableUnits: Array<Game.Unit>;
            spaces: Array<SkirmishPlayer.UiSpace>;
            state: Game.Engine.GameState;
            rCtx: RenderingContext;
            attackCtx: Game.Attack.BaseAttack | null;
            isTargetable: (unit: Game.Unit) => boolean;
            attackMenuVisible: () => boolean;
            $broadcast: (name: string, ...args: any[]) => void;
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
        interface IRouteParams {
            skirmish_id: string;
            state?: string;
            red: string;
            blue: string;
            initiative: string;
        }
    }
}
declare namespace App.Ng {
    abstract class BaseController {
        private static readonly EVENT_NAV_AWAY;
        private readonly subscriptions;
        private readonly $rootScope;
        private readonly locChangeStartUnsub;
        constructor($rootScope: any);
        protected subscribe(eventName: string, listener: Function): void;
        private unsubcribeAll();
    }
}
declare namespace App.Ng {
    class ArmyController extends BaseController {
        static readonly NAME: string;
        static readonly PATH: string;
        static readonly HTML_NAME: string;
        private static readonly DEPLOYMENTS_LIST_PATH;
        private static readonly ID_NEW;
        private readonly $scope;
        private readonly armyCache;
        constructor($rootScope: any, $scope: ArmyController.IScope, $http: any, armyCache: App.Ng.ArmyCache);
        private selectArmy();
        private removeArmy();
        private getArmy(id);
        private onListLoaded(res);
        private removeDeployment(index);
        private addDeployment(id);
        private saveArmy();
        private createTitle();
        private selectNewArmyOption();
    }
    module ArmyController {
        interface IScope {
            availableIds: Array<string>;
            deployments: [string, string];
            selectedIds: Array<string>;
            armies: Array<App.Model.IArmy>;
            armyTitle: string | null;
            selectedArmyId: string;
            addDeployment(id: string): any;
            removeDeployment(index: number): any;
            saveArmy(): any;
            selectArmy(): any;
            removeArmy(): any;
        }
    }
}
declare namespace App.Ng {
    class RootController {
        static readonly NAME: string;
        static readonly PATH: string;
        static readonly HTML_NAME: string;
        private readonly $scope;
        private readonly stateCache;
        constructor($scope: RootController.IScope, $http: any, stateCache: StateCache);
        private onSkirmishListLoad(res);
        private createRequest();
        private createText(save, skirmishes);
    }
    module RootController {
        interface ISaveUrl {
            text: string;
            url: string;
        }
        interface IScope {
            skirmishes: Array<Model.IItemInfo>;
            saveUrls: Array<ISaveUrl>;
        }
    }
}
declare namespace App.Ng {
    class ScriptLoaderController implements AbilityLoader.IRequestListener {
        static readonly NAME: string;
        private readonly $scope;
        private readonly $timeout;
        constructor($scope: ScriptLoaderController.IScope, $timeout: Function, abilityLoader: AbilityLoader);
        requestScript(src: string): boolean;
        private isScriptRegistered(src);
    }
    module ScriptLoaderController {
        interface IJavaScript {
            src: string;
        }
        interface IScope {
            $apply: Function;
            scripts: Array<IJavaScript>;
        }
    }
}
declare namespace App.Ng {
    class SkirmishController {
        static readonly NAME: string;
        static readonly PATH: string;
        static readonly HTML_NAME: string;
        static readonly EVENT_SAVE_STATE: string;
        private readonly $scope;
        constructor($scope: any);
        private saveState();
    }
}
declare namespace App.Ng {
    class SkirmishSetupController {
        static readonly NAME: string;
        static readonly PATH: string;
        static readonly HTML_NAME: string;
        private readonly $scope;
        constructor($scope: SkirmishSetupController.IScope, $routeParams: SkirmishSetupController.IRouteParams, armyCache: App.Ng.ArmyCache);
    }
    module SkirmishSetupController {
        interface IRouteParams {
            id: string;
        }
        interface IScope {
            armies: Array<App.Model.IArmy>;
            skirmishId: string;
            firstArmy: number;
            secondArmy: number;
        }
    }
}
declare namespace App.Ng {
    class TileBuilderController {
        static readonly NAME: string;
        static readonly PATH: string;
        static readonly HTML_NAME: string;
        private readonly $scope;
        private selectedLocations;
        constructor($scope: TileBuilderController.IScope);
        private isSelected(x, y);
        private toggleSpace(x, y);
        private selectSide();
        private export();
    }
    module TileBuilderController {
        interface IScope {
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
            isSelected(x: number, y: any): any;
            toggleSpace(x: number, y: number): any;
            selectSide(): any;
            export(): any;
        }
        class Space {
            x: number;
            y: number;
            top?: string;
            left?: string;
            bottom?: string;
            right?: string;
            constructor(x: number, y: number);
        }
    }
}
declare namespace App.Ng {
    /**
     * This directive exists because if the script src attr is populated
     * with angular-formatted arguments, the page will attempt to load those non-urls.
     */
    class LazySrcDirective {
        static readonly NAME: string;
        static readonly RESTRICT: string;
        private static counter;
        constructor($scope: any, $element: any, $attr: any);
    }
}
declare namespace App.Ng {
    class SpaceDirective {
        static readonly NAME: string;
        static readonly RESTRICT: string;
        static readonly ISOLATE_SCOPE: {
            space: string;
            rctx: string;
        };
        private readonly ctx;
        private readonly uiSpace;
        private readonly state;
        constructor($scope: SpaceDirective.IScope, $element: any, $attr: any);
        render(): void;
        private renderSpaceCost(size);
    }
    module SpaceDirective {
        interface IScope {
            $watch: Function;
            space: SkirmishPlayer.UiSpace;
            rctx: RenderingContext;
        }
    }
}
declare namespace App.Ng {
    /**
     * This directive exists because if the script src attr is populated
     * with angular-formatted arguments, the page will attempt to load those non-urls.
     */
    class SymbolizeDirective {
        static readonly NAME: string;
        static readonly RESTRICT: string;
        static readonly ISOLATE_SCOPE: {
            symbolize: string;
        };
        private static readonly EXCLUSIONS;
        constructor($scope: SymbolizeDirective.IScope, $element: any, $attr: any);
    }
    module SymbolizeDirective {
        interface IScope {
            symbolize: string;
        }
    }
}
declare namespace App.Ng {
    class UnitDirective {
        static readonly NAME: string;
        static readonly RESTRICT: string;
        static readonly ISOLATE_SCOPE: {
            unit: string;
            targetable: string;
            targeted: string;
        };
        private readonly unit;
        private readonly ctx;
        private readonly classColor;
        private targetable;
        private targeted;
        constructor($scope: UnitDirective.IScope, $element: any);
        private checkTargetable(newValue, oldValue);
        private checkTargeted(newValue, oldValue);
        private render();
        private drawBase(w, h);
        private drawImage(w, h);
        private drawHealth(w, h);
        private drawAffiliation(w, h);
        private drawTarget(w, h, color);
    }
    module UnitDirective {
        interface IScope {
            unit: Game.Unit;
            targetable: Array<Game.Unit>;
            $watch: Function;
        }
    }
}
declare namespace App.Ng.Util.SpaceRenderer {
    function renderSpace(ctx: CanvasRenderingContext2D, space: Game.Space): void;
}
