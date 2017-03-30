namespace App.Game.Engine {

    export class GameEngine {

        public readonly state: GameState;
        private readonly scopeValidator: Validation.ScopeValidator;
        private readonly targetValidator: Validation.TargetValidator;

        constructor(gameState: GameState) {
            this.state = gameState;
            this.scopeValidator = new Validation.ScopeValidator();
            this.targetValidator = new Validation.TargetValidator(gameState);
            this.deploy();

            (<any>window).engine = this;
        }

        public activate(unit: Game.Unit): IResult {

            if (this.state.activeGroup !== null) {
                if (unit.activeWaiting && unit.groupId == this.state.activeGroup.id) {
                    // The unit can activate
                    if (this.state.activeGroup.activeUnit !== null) {
                        return failure("There's already an active unit");
                    }
                    unit.state = ActivationState.ACTIVE;
                    return { success: true };
                }
                return failure(`There's already an active group`);
            }

            let group = this.state.group(unit.zoneColor, unit.groupId);

            if (group.exausted) {
                return failure("That group is exausted");
            }

            if (this.state.activeZone !== group.zoneColor) {
                return failure(`It's not ${unit.zoneColor}'s turn`);
            }

            group.activate(unit.id);

            return SUCCESS;
        }

        public exaust(unit: Unit): IResult {
            if (unit.state !== ActivationState.ACTIVE) {
                return failure("Unit is not active");
            }

            unit.state = ActivationState.EXAUSTED;
            let group = this.state.group(unit.zoneColor, unit.groupId);



            this.checkRound();

            return SUCCESS;
        }

        

        public move(unit: Unit, spaces: Array<Space>): IResult {

            let initialX = unit.x;
            let initialY = unit.y;
            let cost = 0;

            for (let space of spaces) {
                if (Util.accessible(unit.x, unit.y, space.x, space.y, this.state.skirmish.spaces)) {
                    unit.x = space.x;
                    unit.y = space.y;
                    cost++;
                } else {
                    unit.x = initialX;
                    unit.y = initialY;
                    return failure(`${space.x},${space.y} is not accessible to the unit`);
                }
            }

            unit.movementPoints -= cost;

            return SUCCESS;
        }

        public beginAction(unit:Unit, ability:Ability): ActionExecutable {
            return new ActionExecutable(unit, ability);
        }

        private deploy() {
            for (let army of this.state.armies) {
                for (let unit of army.units) {
                    if (unit.x !== 0 || unit.y !== 0) {
                        // already deployed
                        continue;
                    }

                    let zone = this.getDeploymentZone(unit.zoneColor);
                    for (let space of zone.spaces) {
                        if (!this.state.occupied(space.x, space.y)) {
                            unit.x = space.x;
                            unit.y = space.y;
                            break;
                        }
                    }
                }
            }

        }

        private getDeploymentZone(zoneColor: ZoneColor): App.Model.IDeploymentZone {
            for (let zone of this.state.skirmish.deploymentZones) {
                if (toZoneColor(zone.color) === zoneColor) {
                    return zone;
                }
            }
            throw new Error(`Cannot find zone with color:${ZoneColor[zoneColor]}`);
        }

        private checkRound() {
            for (let army of this.state.armies) {
                for (let group of army.groups) {
                    if (!group.exausted) {
                        // There are more groups to go
                        return;
                    }
                }
            }

            this.state.round++;
            for (let army of this.state.armies) {
                for (let group of army.groups) {
                    group.ready();
                }
            }
        }
    }
}