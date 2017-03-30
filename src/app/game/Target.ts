namespace App.Game {
    export class Target {

        public readonly requirements: Array<Target.Requirement>;

        constructor(data: Model.ITarget) {
            this.requirements = new Array<Target.Requirement>();
            for (let reqName of data.requirements) {
                let req = Target.Requirement[reqName.toUpperCase()];
                if (req === undefined) {
                    throw new Error(`Unknown ability target ${reqName}`);
                }
                this.requirements.push(req);
            }
        }

        public validTargetUnit(actor: Unit, unit: Unit): boolean {
            for (let req of this.requirements) {
                switch (req) {
                    case Target.Requirement.SELF:
                        if (actor.uniqueId !== unit.uniqueId) {
                            return false;
                        }
                        break;
                    case Target.Requirement.HOSTILE_FIGURE:
                        if (actor.zoneColor === unit.zoneColor) {
                            return false;
                        }
                        break;
                    case Target.Requirement.LOS:
                        throw new Error("Implement LOS");
                    default:
                        return false;
                }
            }
            return true;
        }

        public validTargetSpace(actor: Unit, space: Space): boolean {
            for (let req of this.requirements) {
                switch (req) {
                    case Target.Requirement.SPACE:
                        break;
                    default:
                        return false;
                }
            }
            return true;
        }
    }

    export module Target {
        export enum Requirement {
            SELF,
            HOSTILE_FIGURE,
            SPACE,
            LOS
        }
    }
}