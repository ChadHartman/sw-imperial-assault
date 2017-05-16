/// <reference path="api/node.d.ts"/>

namespace swia.cli {

    class Program {

        private readonly util: any;
        private prompt: prompt.Prompt;

        constructor() {
            this.util = require('util');
            this.prompt = new prompt.RootPrompt();
        }

        run() {
            process.stdin.resume();
            process.stdin.setEncoding('utf8');
            process.stdin.on('data', this.input.bind(this));
            this.showPrompt();
        }

        private input(text) {

            //console.log('received data:', this.util.inspect(text));
            // Clear console process.stdout.write('\x1B[2J');

            let response = this.prompt.input(text);
            switch (response.status) {
                case prompt.Status.REDIRECT:
                    this.prompt = prompt.navigate(response.body!);
                    break;
                case prompt.Status.BAD_REQUEST:
                    console.error(response.body);
                    break;
            }

            this.showPrompt();

            if (text === 'quit\n') {
                process.exit();
            }
        }

        private showPrompt() {
            console.log(this.prompt.title);
            console.log(this.prompt.prompt);
        }
    }

    export function main() {
        let program = new Program();
        program.run();
    }
}

// Let everything load before running app
setTimeout(swia.cli.main, 0);