/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class Order extends BaseAbility {
        
        public get id(): string {
            return "order";
        }
        
        public get name(): string {
            return "Order";
        }
    }

    loaded(new Order());
}