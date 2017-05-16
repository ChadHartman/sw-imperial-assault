
namespace swia.persistence {

    interface Model {

    }

    export abstract class StoreService {

        private static instance: StoreService;
        private static impl: any;

        private model: Model;

        constructor() {
            this.loadStore(this.onLoad.bind(this));
        }

        private onLoad(data: string) {
            this.model = JSON.parse(data);
        }

        protected abstract loadStore(callback: (data: string) => void);

        protected abstract synchronizeStore(data: string);
    }
}