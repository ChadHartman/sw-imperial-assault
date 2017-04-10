namespace App.Game {

    export class Unit {

        public static readonly CLASS_ELITE = "elite";
        public static readonly CLASS_REGULAR = "regular";

        public readonly id: number;
        public readonly groupId: number;
        public readonly zoneColor: ZoneColor;
        public readonly deployment: Deployment
        public readonly abilities: Array<any>;
        public readonly uniqueId: string;
        public readonly actions: Array<any>
        public health: number;
        public actionCount: number;
        public _state: ActivationState;
        public movementPoints: number;
        public x: number;
        public y: number;
        // TODO; public health: number;

        constructor(
            id: number,
            groupId: number,
            zoneColor: ZoneColor,
            deployment: Deployment) {

            this.id = id;
            this.groupId = groupId;
            this.uniqueId = `${ZoneColor[zoneColor]}.${deployment.id}.${groupId}.${id}`.toLowerCase();
            this.deployment = deployment;
            this.x = 0;
            this.y = 0;
            this.zoneColor = zoneColor;
            this._state = ActivationState.READY;
            this.movementPoints = 0;
            this.health = deployment.health;
            this.abilities = deployment.abilities;
            this.actions = new Array<any>();
            this.actionCount = 0;

            for (let ability of deployment.abilities) {
                if (ability.isAction || ability.isSpecialAction) {
                    this.actions.push(ability);
                }
            }

            (<any>window).units = (<any>window).units || {};
            (<any>window).units[this.uniqueId] = this;
        }
        public get state(): ActivationState {
            return this._state;
        }
        public set state(value: ActivationState) {
            this._state = value;
            switch (value) {
                case ActivationState.ACTIVE:
                    this.actionCount = 2;
                    break;
                case ActivationState.EXAUSTED:
                    this.actionCount = 0;
                    break;
            }
        }

        public get ready() {
            return this._state === ActivationState.READY;
        }

        public get exausted() {
            return this._state === ActivationState.EXAUSTED;
        }

        public get active() {
            return this._state === ActivationState.ACTIVE;
        }

        public get activeWaiting() {
            return this._state === ActivationState.ACTIVE_WAITING;
        }
    }
}