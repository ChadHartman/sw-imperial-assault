/// <reference path="Prompt.ts"/>

namespace swia.cli.prompt {

    export class ManageArmy implements Prompt {

        public static readonly NAME = "manage_army";

        public readonly prompt = "TODO";

        public input(text: string): Response {
            return { status: Status.OK };
        }
    }

    register(ManageArmy.NAME, ManageArmy);
}