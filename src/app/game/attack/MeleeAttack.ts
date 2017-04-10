/// <reference path="BaseAttack.ts"/>

namespace App.Game.Attack {

    export class MeleeAttack extends BaseAttack {

        protected inRange(accuracy: number): boolean {
            // TODO
            return this.state.distance(this.attacker, this.target!) <= accuracy;
        }

        public targetable(defender: Unit): boolean {
            // TODO
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