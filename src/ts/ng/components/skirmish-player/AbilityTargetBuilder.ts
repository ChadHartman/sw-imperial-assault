namespace App.Ng.SkirmishPlayer {

    export class AbilityTargetBuilder {

        public readonly actor: Game.Unit;
        public readonly ability: Game.Ability
        public readonly targets: Array<Game.Engine.AbilityTarget>;

        constructor(actor: Game.Unit, ability: Game.Ability) {
            this.actor = actor;
            this.ability = ability;
            this.targets = new Array<Game.Engine.AbilityTarget>();
        }

        public addSpace(space: Game.Space): Game.Engine.IResult {
            if (this.ability.target.indexOf(Game.Target.SPACE) === -1) {
                return Game.Engine.failure(`Spaces cannot be targeted`);
            }
            this.targets.push(new Game.Engine.SpaceTarget(space));
            return Game.Engine.SUCCESS;
        }

        public addUnit(unit: Game.Unit): Game.Engine.IResult {

            if (unit.zoneColor !== this.actor.zoneColor) {
                // hostile
                if (this.ability.target.indexOf(Game.Target.HOSTILE_FIGURE) === -1) {
                    return Game.Engine.failure(`Spaces cannot be targeted`);
                }
                this.targets.push(new Game.Engine.UnitTarget(unit));
            } else {
                // friendly
                throw new Error('Not implemented');
            }

            return Game.Engine.SUCCESS;
        }

        public get complete(): boolean {
            for (let target of this.ability.target) {
                switch (target) {
                    case Game.Target.SPACE:
                        if (this.targets.length === 1) {
                            return true;
                        }
                    case Game.Target.HOSTILE_FIGURE:
                        if (this.targets.length === 1) {
                            return true;
                        }
                }
            }
            return false;
        }
    }
}