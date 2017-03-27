namespace App.Game {

    export class Unit {

        public static readonly CLASS_ELITE = "elite";
        public static readonly CLASS_REGULAR = "regular";

        public readonly id: number;
        public readonly groupId: number;
        public readonly zoneColor: ZoneColor;
        public readonly deployment: Deployment
        public readonly abilities: Array<Ability>;
        public readonly uniqueId: string;
        public readonly health: number;
        public readonly actions: Array<Ability>
        public state: ActivationState;
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
            this.state = ActivationState.READY;
            this.movementPoints = 0;
            this.health = deployment.health;
            this.abilities = deployment.abilities;
            this.actions = new Array<Ability>();

            for (let ability of deployment.abilities) {
                if (ability.scope.indexOf(Scope.ACTION) !== -1 ||
                    ability.scope.indexOf(Scope.SPECIAL_ACTION) !== -1) {
                    this.actions.push(ability);
                }
            }

            (<any>window).units = (<any>window).units || {};
            (<any>window).units[this.uniqueId] = this;
        }

        public get ready() {
            return this.state === ActivationState.READY;
        }

        public get exausted() {
            return this.state === ActivationState.EXAUSTED;
        }

        public get active() {
            return this.state === ActivationState.ACTIVE;
        }

        public get activeWaiting() {
            return this.state === ActivationState.ACTIVE_WAITING;
        }

    }
}