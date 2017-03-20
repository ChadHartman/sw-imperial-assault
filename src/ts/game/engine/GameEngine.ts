namespace App.Game.Engine {

    export interface IResult {
        success: boolean;
        message?: string;
    }

    export class GameEngine {

        private readonly state: GameState;

        constructor(gameState: GameState) {
            this.state = gameState;
            this.deploy();

            (<any>window).engine = this;
        }

        public activate(unit: Game.Unit): IResult {

            if (this.state.activeGroup !== null) {
                if (unit.activeWaiting && unit.groupId == this.state.activeGroup.id) {
                    // The unit can activate
                    if (this.state.activeGroup.activeUnit !== null) {
                        return this.failure("There's already an active unit");
                    }
                    unit.state = ActivationState.ACTIVE;
                    return { success: true };
                }
                return this.failure(`There's already an active group`);
            }

            let group = this.state.group(unit.armyColor, unit.groupId);

            if (group.exausted) {
                return this.failure("That group is exausted");
            }

            if (this.state.activeArmy.color !== group.armyColor) {
                return this.failure(`It's not ${unit.armyColor}'s turn`);
            }

            this.state.activeGroup = group;
            group.activate(unit.id);

            return { success: true };
        }

        public exaust(unit: Unit): IResult {
            if (unit.state !== ActivationState.ACTIVE) {
                return this.failure("Unit is not active");
            }

            unit.state = ActivationState.EXAUSTED;
            let group = this.state.group(unit.armyColor, unit.groupId);

            this.checkActiveGroup();
            this.checkRound();

            return { success: true };
        }

        public performAction(unit: Game.Unit, ability: Model.IAbility): IResult {

            let result = this.isScopeValid(unit, ability);
            if (!result.success) {
                return result;
            }

            let targets = this.getTargets(unit, ability);
            this.performEffect(ability, targets);

            return { success: true };
        }

        public getUnitWithId(id: number): Game.Unit {
            for (let army of this.state.armies) {
                for (let unit of army.units) {
                    if (unit.id === id) {
                        return unit;
                    }
                }
            }
            throw new Error(`No unit with id ${id}.`);
        }

        public getUnitAtLocation(x: number, y: number): App.Game.Unit | null {
            for (let army of this.state.armies) {
                for (let unit of army.units) {
                    if (x === unit.x && y === unit.y) {
                        return unit;
                    }
                }
            }
            return null;
        }

        public getSpace(x: number, y: number): App.Game.Space | null {
            for (let space of this.state.skirmish.spaces) {
                if (space.x === x && space.y === y) {
                    return space;
                }
            }
            return null;
        }

        private performEffect(ability: Model.IAbility, targets: Array<Unit>) {
            for (let effect of ability.effects) {
                switch (effect.type) {
                    case Ability.Effect.GAIN_MOVEMENT_POINTS:
                        for (let target of targets) {
                            if (effect.stat) {
                                target.movementPoints += target.deployment.speed;
                            }
                        }
                        break;
                }
            }
        }

        private getTargets(unit: Game.Unit, ability: Model.IAbility): Array<Unit> {

            let targets = new Array<Unit>();

            for (let target of ability.targets) {
                switch (target) {
                    case Ability.Target.SELF:
                        targets.push(unit);
                }
            }

            return targets;
        }

        private isScopeValid(unit: Game.Unit, action: Model.IAbility): IResult {
            for (let condition of action.scope) {
                switch (condition) {
                    case Ability.Scope.ACTION:
                        if (!unit.active) {
                            return this.failure(`Unit must be active to ${action.title}`);
                        }
                        break;
                }
            }

            return { success: true };
        }

        private deploy() {
            for (let army of this.state.armies) {
                for (let unit of army.units) {
                    if (unit.x !== 0 || unit.y !== 0) {
                        // already deployed
                        continue;
                    }

                    let zone = this.getDeploymentZone(unit.armyColor);
                    for (let space of zone.spaces) {
                        if (!this.isOccupied(space.x, space.y)) {
                            unit.x = space.x;
                            unit.y = space.y;
                            break;
                        }
                    }
                }
            }

        }

        private getDeploymentZone(color: string): App.Model.IDeploymentZone {
            for (let zone of this.state.skirmish.deploymentZones) {
                if (zone.color === color) {
                    return zone;
                }
            }
            throw new Error(`Cannot find zone with color:${color}`);
        }

        private isOccupied(x: number, y: number): boolean {
            return this.getUnitAtLocation(x, y) !== null;
        }

        private failure(reason?: string): IResult {
            return {
                success: false,
                message: reason
            }
        }

        private checkActiveGroup() {
            if (this.state.activeGroup !== null && this.state.activeGroup.exausted) {
                // Can move to next turn
                this.state.activeArmyIndex = (this.state.activeArmyIndex + 1) % this.state.armies.length;
                this.state.activeGroup = null;
            }
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