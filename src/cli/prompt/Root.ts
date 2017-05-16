namespace swia.cli.prompt {

    export class RootPrompt extends ListPrompt {

        public static readonly NAME = "root";

        public readonly title = "SWIA CLI"

        protected getOptions(): string[] {
            return [
                "Manage Armies"
            ];
        }

        protected selectOption(index: number): Response {
            switch (index) {
                case 0:
                    return Response.createRedirect(ManageArmy.NAME);
            }
            return this.createInvalidOptionResponse(index);
        }
    }

    register(RootPrompt.NAME, RootPrompt);
}