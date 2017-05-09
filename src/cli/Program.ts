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
            console.log(this.prompt.prompt);
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
            
            console.log(this.prompt.prompt);

            if (text === 'quit\n') {
                process.exit();
            }
        }
    }

    export function main() {
        let program = new Program();
        program.run();
    }
}

setTimeout(swia.cli.main, 0);