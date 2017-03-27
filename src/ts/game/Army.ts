namespace App.Game {

    export class Army {

        public readonly id: number;
        public readonly title: string;
        public readonly units: Array<Unit>;
        public readonly groups: Array<Group>;
        public readonly zoneColor: ZoneColor;

        constructor(
            id: number,
            title: string,
            zoneColor: ZoneColor,
            deployments: Array<Deployment>) {

            this.id = id;
            this.title = title;
            let groupId = 1;

            this.zoneColor = zoneColor;
            this.units = [];
            this.groups = [];

            // TODO: sort deployments
            for (let deployment of deployments) {
                let group = new Group(groupId, zoneColor);
                this.groups.push(group);
                for (let i = 1; i <= deployment.groupSize; i++) {
                    let unit = new Unit(i, groupId, zoneColor, deployment);
                    this.units.push(unit);
                    group.units.push(unit);
                }
                groupId++;
            }
        }
    }
}