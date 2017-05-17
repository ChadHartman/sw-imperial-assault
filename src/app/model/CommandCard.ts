namespace swia.model {
    export interface CommandCard {
        id: string;
        title: string;
        affiliation?: string;
        restrictions?: string[];
        cost: number;
        limit: number;
        url: string
    }
}