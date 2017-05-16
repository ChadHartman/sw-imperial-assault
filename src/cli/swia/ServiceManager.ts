namespace swia {
    export class ServiceManager {

        private assetServiceImpl: any;
        private assetServiceInstance: asset.AssetService;
        private storeServiceImpl: any;
        private storeServiceInstance: persistence.StoreService;

        constructor() {
        }

        public bindAssetService(impl: any) {
            if (this.assetServiceImpl) {
                throw new Error("Asset service implementation already set");
            }
            this.assetServiceImpl = impl;
        }

        public get assetService(): asset.AssetService {

            if(!this.assetServiceImpl) {
                throw new Error("Asset service implementation not set");
            }

            return this.assetServiceInstance || 
                (this.assetServiceInstance = new this.assetServiceImpl());
        }

        public bindStoreService(impl: any) {
            if (this.storeServiceImpl) {
                throw new Error("Asset service implementation already set");
            }
            this.storeServiceImpl = impl;
        }

        public get storeService(): persistence.StoreService {

            if(!this.storeServiceImpl) {
                throw new Error("Asset service implementation not set");
            }

            return this.storeServiceInstance || 
                (this.storeServiceInstance = new this.storeServiceImpl());
        }

    }

    export const services = new ServiceManager();
}