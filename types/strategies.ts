export interface ContentStrategy {
    id: number;
    name: string;
    description: string;
    team: number;
    created: string;
    modified: string;
}

export interface SeedKeyword {
    keyword: string;
    searchVolume: number;
    contentStrategy: number;
}    