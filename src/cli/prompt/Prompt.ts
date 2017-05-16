namespace swia.cli.prompt {

    export enum Status {
        OK = 200,
        REDIRECT = 301,
        BAD_REQUEST = 400
    }

    export interface Response {
        status: Status;
        body?: string;
    }

    export module Response {

        export const RESPONSE_OK: Response = { status: Status.OK };

        export function createBadRequest(body: string): Response {
            return { status: Status.BAD_REQUEST, body: body };
        }

        export function createRedirect(name: string): Response {
            return { status: Status.REDIRECT, body: name };
        }
    }

    export interface Prompt {
        title: string;
        prompt: string;
        input: (text: string) => Response;
    }

    const registry: [string, Prompt] = <[string, Prompt]>{};

    export function register(name: string, promptClass: any) {
        registry[name] = promptClass;
    }

    export function navigate(name: string): Prompt {
        return new registry[name]();
    }
}