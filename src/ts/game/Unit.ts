namespace App.Game {



    export class Unit {

        public static readonly CLASS_ELITE = "elite";
        public static readonly CLASS_REGULAR = "regular";

        public readonly id: number;
        public readonly groupId: number;
        public readonly armyColor: string;
        public readonly deployment: Deployment
        public readonly abilities: Array<Model.IAbility>;
        public readonly uniqueId: string;
        public readonly health: number;
        public readonly actions: Array<Model.IAbility>
        public state: ActivationState;
        public movementPoints: number;
        public x: number;
        public y: number;
        // TODO; public health: number;

        constructor(
            id: number,
            groupId: number,
            armyColor: string,
            deployment: Deployment) {

            this.id = id;
            this.groupId = groupId;
            this.uniqueId = `${armyColor}.${deployment.id}.${groupId}.${id}`;
            this.deployment = deployment;
            this.x = 0;
            this.y = 0;
            this.armyColor = armyColor;
            this.state = ActivationState.READY;
            this.abilities = deployment.abilities;
            this.movementPoints = 0;
            this.health = deployment.health;

            this.actions = [];
            for (let ability of this.abilities) {
                if (ability.scope.indexOf(Ability.Scope.ACTION) !== -1 ||
                    ability.scope.indexOf(Ability.Scope.SPECIAL_ACTION) !== -1) {
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