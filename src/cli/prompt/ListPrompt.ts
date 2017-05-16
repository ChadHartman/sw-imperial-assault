/// <reference path="Prompt.ts"/>

namespace swia.cli.prompt {

    export abstract class ListPrompt implements Prompt {

        public abstract title;

        public get prompt(): string {

            let prompt = "";
            let i = 1;

            for (let option of this.getOptions()) {
                prompt += `${prompt.length > 0 ? "\n" : ""}${i++}: ${option}`;
            }

            return prompt;
        }

        protected abstract getOptions(): string[];

        protected abstract selectOption(index: number): Response;

        protected createInvalidOptionResponse(index: number): Response {
            return Response.createBadRequest(`Invalid option: "${index}"`);
        }

        public input(text: string): Response {
            if (util.isNumber(text) && util.isInteger(text)) {
                return this.selectOption(parseInt(text) - 1);
            } else {
                return {
                    status: Status.BAD_REQUEST,
                    body: `"${text} is an invalid option`
                };
            }
        }
    }
}