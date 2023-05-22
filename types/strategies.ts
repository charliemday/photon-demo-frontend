export interface Geography {
    id: number;
    label: string;
    name: string;
}
export interface ContentStrategy {
    id: number;
    name: string;
    description: string;
    team: number;
    created: string;
    modified: string;
    geography: number | Geography;
    status: string;
    blogCount: number;
    seedKeywordCount: number;
}


export enum SeedKeywordSource {
    USER = 'user',
    COMPETITOR = 'competitor'
}

export interface SeedKeyword {
    id: number;
    keyword: string;
    searchVolume: number;
    contentStrategy: number;
    /**
     * Where did the keyword come from?
     */
    source: SeedKeywordSource
    /**
     * The difficulty of the keyword
     */
    difficulty: number | null;
}
