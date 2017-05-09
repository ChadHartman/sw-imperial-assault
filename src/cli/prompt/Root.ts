namespace swia.cli.prompt {

    export class RootPrompt extends ListPrompt {

        public static readonly NAME = "root";

        protected getOptions(): string[] {
            return [
                "Manage Armies"
            ];
        }

        protected selectOption(index: number): Response {
            switch (index) {
                case 0:
                    return {
                        status: Status.REDIRECT,
                        body: ManageArmy.NAME
                    };
            }

            return {
                status: Status.BAD_REQUEST,
                body: `Invalid option: "${index}`
            };
        }

    }

    register(RootPrompt.NAME, RootPrompt);
}