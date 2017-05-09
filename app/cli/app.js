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
                console.log(this.prompt.prompt);
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
                console.log(this.prompt.prompt);
                if (text === 'quit\n') {
                    process.exit();
                }
            }
        }
        function main() {
            let program = new Program();
            program.run();
        }
        cli.main = main;
    })(cli = swia.cli || (swia.cli = {}));
})(swia || (swia = {}));
setTimeout(swia.cli.main, 0);
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
        (function (prompt) {
            class ManageArmy {
                constructor() {
                    this.prompt = "TODO";
                }
                input(text) {
                    return { status: prompt.Status.OK };
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
                getOptions() {
                    return [
                        "Manage Armies"
                    ];
                }
                selectOption(index) {
                    switch (index) {
                        case 0:
                            return {
                                status: prompt.Status.REDIRECT,
                                body: prompt.ManageArmy.NAME
                            };
                    }
                    return {
                        status: prompt.Status.BAD_REQUEST,
                        body: `Invalid option: "${index}`
                    };
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
//# sourceMappingURL=app.js.map