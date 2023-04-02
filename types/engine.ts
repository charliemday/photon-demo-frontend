export interface MissingKeyword {
    ctr: string;
    clicks: number;
    keyword: string;
    position: number;
    impressions: number;
}

export interface WordSeekItem {
    id: number;
    missingKeywords: MissingKeyword[];
    created: string;
    modified: string;
    page: string;
    team: number;
    user: number;
}