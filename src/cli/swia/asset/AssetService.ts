
namespace swia.asset {

    export abstract class AssetService {

        private static instance: AssetService;
        private static impl: any;

        public static bindImplementation(impl: any) {
            if (this.impl) {
                throw new Error("Implementation already bound");
            }
            this.impl = impl;
        }

        public static getService(): AssetService {

            if (!this.impl) {
                throw new Error("Implementation never bound");
            }

            return AssetService.instance ?
                AssetService.instance :
                AssetService.instance = new AssetService.impl();
        }

        public abstract fetchAsset(type: AssetType, id: string, callback: (asset) => void);
    }
}