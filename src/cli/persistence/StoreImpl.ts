/// <reference path="../swia/persistence/StoreService.ts"/>

namespace swia.cli.persistence {

    class StoreImpl extends swia.persistence.StoreService {

        private readonly fileStore;
        private readonly path: string;

        constructor() {
            super();
            this.path = "~/Desktop/swia.json";
            this.fileStore = require('fs');
        }

        protected loadStore(callback: (data: string) => void) {
            this.fileStore.readFile(this.path, 'utf8', function (err, data) {
                if (err) {
                    console.error("Could not open file: %s", err);
                } else {
                    callback(data)
                }
            });
        }

        protected synchronizeStore(data: string) {
            this.fileStore.writeFile(this.path, data, function (err) {
                if (err) {
                    console.error("Could not write file: %s", err);
                }
            });

        }
    }

    swia.services.bindStoreService(StoreImpl);
}