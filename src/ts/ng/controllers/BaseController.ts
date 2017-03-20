namespace App.Ng {

    export abstract class BaseController {

        private static readonly EVENT_NAV_AWAY = "$locationChangeStart";
        private readonly subscriptions: [string, Function];
        private readonly $rootScope;
        private readonly locChangeStartUnsub;

        constructor($rootScope) {
            // TODO: remove
            (<any>window).$rootScope = $rootScope;
            this.$rootScope = $rootScope;
            this.subscriptions = <[string, Function]>{};
            this.subscribe(
                BaseController.EVENT_NAV_AWAY,
                this.unsubcribeAll.bind(this));
        }

        protected subscribe(eventName: string, listener: Function) {
            let unsub = this.$rootScope.$on(eventName, listener);
            this.subscriptions[eventName] = unsub;
        }

        private unsubcribeAll() {
            for (let key in this.subscriptions) {
                let unsub = <Function>this.subscriptions[key];
                unsub();
            }
        }
    }
}