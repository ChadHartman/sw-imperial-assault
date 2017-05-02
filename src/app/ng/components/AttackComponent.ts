/// <reference path="../modules/App.ts"/>

namespace App.Ng {

    /**
     * Receives UI Events and interprets them into Game Actions.
     * Renders game state.
     * 
     * 
     */
    export class AttackController {

        public static readonly NAME = "attackController";
        public static readonly EVENT_ATTACK_BEGIN = "attack_begin";
        public static readonly EVENT_ATTACK_COMPLETE = "attack_complete";

        constructor(
            private readonly $scope: AttackController.IScope
        ) {
            this.$scope.$on(AttackController.EVENT_ATTACK_BEGIN, this.onAttackBegin.bind(this));
            this.$scope.complete = this.complete.bind(this);
            this.$scope.spendSurge = this.spendSurge.bind(this);
            this.$scope.rerollAttackDie = this.rerollAttackDie.bind(this);
            this.$scope.rerollDefenseDie = this.rerollDefenseDie.bind(this);

            App.debug[AttackController.NAME] = this;
        }

        private onAttackBegin(event, ctx: Game.Attack.BaseAttack) {
            this.$scope.ctx = ctx;
        }


        private rerollAttackDie(roll: Game.Attack.IAttackDieRoll) {
            //(this.$scope.attackCtx!).reroll(roll.id);
            roll.side = roll.die.roll();
        }

        private rerollDefenseDie(roll: Game.Attack.IDefenseDieRoll) {
            roll.side = roll.die.roll();
            //(this.$scope.attackCtx!).reroll(roll.id);
        }

        private spendSurge(surge: Game.Surge) {
            if (this.$scope.ctx === null) {
                throw new Error('No current attack');
            }

            this.$scope.ctx.spendSurge(surge);
        }

        private complete() {
            
            this.$scope.$emit(AttackController.EVENT_ATTACK_COMPLETE);
        }
    }

    export module AttackController {
        export interface IScope {
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

App.Ng.module.controller(App.Ng.AttackController.NAME,
    [
        '$scope',
        App.Ng.AttackController
    ]
);

App.Ng.module.component('attack', {
    templateUrl: 'assets/html/component/attack.html',
    controller: App.Ng.AttackController.NAME
});