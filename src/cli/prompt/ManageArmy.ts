/// <reference path="ListPrompt.ts"/>

namespace swia.cli.prompt {

    export class ManageArmy extends ListPrompt {

        public static readonly NAME = "manage_army";

        public readonly title = "Manage Army";

        protected getOptions(): string[] {
            return [
                "Create new army...",
                "Return..."
            ];
        }

        protected selectOption(index: number): Response {
            switch (index) {
                case 0:
                    return Response.RESPONSE_OK;
                case 1:
                    return Response.createRedirect(RootPrompt.NAME);
            }

            return this.createInvalidOptionResponse(index);
        }
    }

    register(ManageArmy.NAME, ManageArmy);
}