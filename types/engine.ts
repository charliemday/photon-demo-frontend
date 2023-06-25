import { TeamMin } from "./team";
import { UserMin } from "./user";

export interface MissingKeyword {
    ctr: string;
    clicks: number;
    keyword: string;
    position: number;
    impressions: number;
}

export interface JobInterface {
    id: number;
    site: string;
}

export interface WordSeekItem {
    id: number;
    missingKeywords: MissingKeyword[];
    created: string;
    modified: string;
    page: string;
    team: number;
    user: number;
    jobs: JobInterface;
}

export interface WordSeekJob {
    progress: number;
    jobsRemaining: number;
    jobsCompleted: number;
    user: UserMin;
    jobType: WordSeekJobType;
    jobCreated: string;
    site: string;
    jobGroupUuid: string;
    team: TeamMin;
}

export enum WordSeekJobType {
    SINGLE_PAGE = "single_page",
    FULL_SITE = "full_site",
}

export interface Faq {
    id: number;
    question: string;
    impressions: number;
    clicks: number;
    position: number;
    answer: string;
    team: number;
    result: number;
    isActive: boolean;
}


export interface ExistingContent {
    id: number;
    query: string;
    impressions: number;
    clicks: number;
    position: number;
    team: number;
    result: number;
    isActive: boolean;
}