"use strict";
var swia;
(function (swia) {
    var persistence;
    (function (persistence) {
        class StoreService {
            constructor() {
                this.loadStore(this.onLoad.bind(this));
            }
            onLoad(data) {
                this.model = JSON.parse(data);
            }
        }
        persistence.StoreService = StoreService;
    })(persistence = swia.persistence || (swia.persistence = {}));
})(swia || (swia = {}));
/// <reference path="../swia/persistence/StoreService.ts"/>
"use strict";
var swia;
(function (swia) {
    var cli;
    (function (cli) {
        var persistence;
        (function (persistence) {
            class StoreImpl extends swia.persistence.StoreService {
                constructor() {
                    super();
                    this.path = "~/Desktop/swia.json";
                    this.fileStore = require('fs');
                }
                loadStore(callback) {
                    this.fileStore.readFile(this.path, 'utf8', function (err, data) {
                        if (err) {
                            console.error("Could not open file: %s", err);
                        }
                        else {
                            callback(data);
                        }
                    });
                }
                synchronizeStore(data) {
                    this.fileStore.writeFile(this.path, data, function (err) {
                        if (err) {
                            console.error("Could not write file: %s", err);
                        }
                    });
                }
            }
            swia.services.bindStoreService(StoreImpl);
        })(persistence = cli.persistence || (cli.persistence = {}));
    })(cli = swia.cli || (swia.cli = {}));
})(swia || (swia = {}));
/// <reference path="api/node.d.ts"/>
"use strict";
var swia;
(function (swia) {
    var cli;
    (function (cli) {
        class Program {
            constructor() {
                this.util = require('util');
                this.prompt = new cli.prompt.RootPrompt();
            }
            run() {
                process.stdin.resume();
                process.stdin.setEncoding('utf8');
                process.stdin.on('data', this.input.bind(this));
                this.showPrompt();
            }
            input(text) {
                //console.log('received data:', this.util.inspect(text));
                // Clear console process.stdout.write('\x1B[2J');
                let response = this.prompt.input(text);
                switch (response.status) {
                    case cli.prompt.Status.REDIRECT:
                        this.prompt = cli.prompt.navigate(response.body);
                        break;
                    case cli.prompt.Status.BAD_REQUEST:
                        console.error(response.body);
                        break;
                }
                this.showPrompt();
                if (text === 'quit\n') {
                    process.exit();
                }
            }
            showPrompt() {
                console.log(this.prompt.title);
                console.log(this.prompt.prompt);
            }
        }
        function main() {
            let program = new Program();
            program.run();
        }
        cli.main = main;
    })(cli = swia.cli || (swia.cli = {}));
})(swia || (swia = {}));
// Let everything load before running app
setTimeout(swia.cli.main, 0);
"use strict";
var swia;
(function (swia) {
    var cli;
    (function (cli) {
        var prompt;
        (function (prompt) {
            var Status;
            (function (Status) {
                Status[Status["OK"] = 200] = "OK";
                Status[Status["REDIRECT"] = 301] = "REDIRECT";
                Status[Status["BAD_REQUEST"] = 400] = "BAD_REQUEST";
            })(Status = prompt.Status || (prompt.Status = {}));
            var Response;
            (function (Response) {
                Response.RESPONSE_OK = { status: Status.OK };
                function createBadRequest(body) {
                    return { status: Status.BAD_REQUEST, body: body };
                }
                Response.createBadRequest = createBadRequest;
                function createRedirect(name) {
                    return { status: Status.REDIRECT, body: name };
                }
                Response.createRedirect = createRedirect;
            })(Response = prompt.Response || (prompt.Response = {}));
            const registry = {};
            function register(name, promptClass) {
                registry[name] = promptClass;
            }
            prompt.register = register;
            function navigate(name) {
                return new registry[name]();
            }
            prompt.navigate = navigate;
        })(prompt = cli.prompt || (cli.prompt = {}));
    })(cli = swia.cli || (swia.cli = {}));
})(swia || (swia = {}));
/// <reference path="Prompt.ts"/>
"use strict";
var swia;
(function (swia) {
    var cli;
    (function (cli) {
        var prompt;
        (function (prompt_1) {
            class ListPrompt {
                get prompt() {
                    let prompt = "";
                    let i = 1;
                    for (let option of this.getOptions()) {
                        prompt += `${prompt.length > 0 ? "\n" : ""}${i++}: ${option}`;
                    }
                    return prompt;
                }
                createInvalidOptionResponse(index) {
                    return prompt_1.Response.createBadRequest(`Invalid option: "${index}"`);
                }
                input(text) {
                    if (cli.util.isNumber(text) && cli.util.isInteger(text)) {
                        return this.selectOption(parseInt(text) - 1);
                    }
                    else {
                        return {
                            status: prompt_1.Status.BAD_REQUEST,
                            body: `"${text} is an invalid option`
                        };
                    }
                }
            }
            prompt_1.ListPrompt = ListPrompt;
        })(prompt = cli.prompt || (cli.prompt = {}));
    })(cli = swia.cli || (swia.cli = {}));
})(swia || (swia = {}));
/// <reference path="ListPrompt.ts"/>
"use strict";
var swia;
(function (swia) {
    var cli;
    (function (cli) {
        var prompt;
        (function (prompt) {
            class ManageArmy extends prompt.ListPrompt {
                constructor() {
                    super(...arguments);
                    this.title = "Manage Army";
                }
                getOptions() {
                    return [
                        "Create new army...",
                        "Return..."
                    ];
                }
                selectOption(index) {
                    switch (index) {
                        case 0:
                            return prompt.Response.RESPONSE_OK;
                        case 1:
                            return prompt.Response.createRedirect(prompt.RootPrompt.NAME);
                    }
                    return this.createInvalidOptionResponse(index);
                }
            }
            ManageArmy.NAME = "manage_army";
            prompt.ManageArmy = ManageArmy;
            prompt.register(ManageArmy.NAME, ManageArmy);
        })(prompt = cli.prompt || (cli.prompt = {}));
    })(cli = swia.cli || (swia.cli = {}));
})(swia || (swia = {}));
"use strict";
var swia;
(function (swia) {
    var cli;
    (function (cli) {
        var prompt;
        (function (prompt) {
            class RootPrompt extends prompt.ListPrompt {
                constructor() {
                    super(...arguments);
                    this.title = "SWIA CLI";
                }
                getOptions() {
                    return [
                        "Manage Armies"
                    ];
                }
                selectOption(index) {
                    switch (index) {
                        case 0:
                            return prompt.Response.createRedirect(prompt.ManageArmy.NAME);
                    }
                    return this.createInvalidOptionResponse(index);
                }
            }
            RootPrompt.NAME = "root";
            prompt.RootPrompt = RootPrompt;
            prompt.register(RootPrompt.NAME, RootPrompt);
        })(prompt = cli.prompt || (cli.prompt = {}));
    })(cli = swia.cli || (swia.cli = {}));
})(swia || (swia = {}));
"use strict";
var swia;
(function (swia) {
    var asset;
    (function (asset_1) {
        class AssetService {
            static bindImplementation(impl) {
                if (this.impl) {
                    throw new Error("Implementation already bound");
                }
                this.impl = impl;
            }
            static getService() {
                if (!this.impl) {
                    throw new Error("Implementation never bound");
                }
                return AssetService.instance ?
                    AssetService.instance :
                    AssetService.instance = new AssetService.impl();
            }
        }
        asset_1.AssetService = AssetService;
    })(asset = swia.asset || (swia.asset = {}));
})(swia || (swia = {}));
"use strict";
var swia;
(function (swia) {
    var asset;
    (function (asset) {
        var AssetType;
        (function (AssetType) {
            AssetType[AssetType["DEPLOYMENT"] = 0] = "DEPLOYMENT";
        })(AssetType = asset.AssetType || (asset.AssetType = {}));
    })(asset = swia.asset || (swia.asset = {}));
})(swia || (swia = {}));
"use strict";
"use strict";
var swia;
(function (swia) {
    class ServiceManager {
        constructor() {
        }
        bindAssetService(impl) {
            if (this.assetServiceImpl) {
                throw new Error("Asset service implementation already set");
            }
            this.assetServiceImpl = impl;
        }
        get assetService() {
            if (!this.assetServiceImpl) {
                throw new Error("Asset service implementation not set");
            }
            return this.assetServiceInstance ||
                (this.assetServiceInstance = new this.assetServiceImpl());
        }
        bindStoreService(impl) {
            if (this.storeServiceImpl) {
                throw new Error("Asset service implementation already set");
            }
            this.storeServiceImpl = impl;
        }
        get storeService() {
            if (!this.storeServiceImpl) {
                throw new Error("Asset service implementation not set");
            }
            return this.storeServiceInstance ||
                (this.storeServiceInstance = new this.storeServiceImpl());
        }
    }
    swia.ServiceManager = ServiceManager;
    swia.services = new ServiceManager();
})(swia || (swia = {}));
"use strict";
var swia;
(function (swia) {
    var cli;
    (function (cli) {
        var util;
        (function (util) {
            function isNumber(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
            util.isNumber = isNumber;
            function isInteger(x) {
                return x % 1 === 0;
            }
            util.isInteger = isInteger;
        })(util = cli.util || (cli.util = {}));
    })(cli = swia.cli || (swia.cli = {}));
})(swia || (swia = {}));
//# sourceMappingURL=cli.js.map