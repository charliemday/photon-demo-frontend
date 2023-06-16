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
    id: number;
    created: string;
    modified: string;
    site: string;
    page: string;
    jobType: string;
    jobStatus: string;
    team: TeamMin;
    user: UserMin;
    jobGroupUuid: string;
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
    is_active: boolean;
}
