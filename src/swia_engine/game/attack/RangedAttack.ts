/// <reference path="BaseAttack.ts"/>

namespace SwiaEngine.Game.Attack {

    export class RangedAttack extends BaseAttack {

        protected inRange(accuracy: number): boolean {
            return this.state.distance(this.attacker, this.target!) <= accuracy;
        }

        public targetable(defender: Unit): boolean {
            if (this.attacker.zoneColor === defender.zoneColor) {
                return false;
            }

            if (!this.state.los(this.attacker, defender)) {
                return false;
            }

            return true;
        }
    }
}