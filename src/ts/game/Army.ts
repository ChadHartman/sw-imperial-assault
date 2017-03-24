namespace App.Game {



    export class Army {

        public readonly id: number;
        public readonly title: string;
        public readonly units: Array<Unit>;
        public readonly groups: Array<Group>;
        public readonly color: string;

        constructor(
            id: number,
            title: string,
            color: string,
            deployments: Array<Deployment>) {


            this.id = id;
            this.title = title;
            let groupId = 1;

            this.color = color;
            this.units = [];
            this.groups = [];

            for (let deployment of deployments) {
                let group = new Group(groupId, color);
                this.groups.push(group);
                for (let i = 1; i <= deployment.groupSize; i++) {
                    let unit = new Unit(i, groupId, color, deployment);
                    this.units.push(unit);
                    group.units.push(unit);
                }
                groupId++;
            }
        }
    }
}