import { ConvertToSnakeCase, Team, TeamType } from "types";

export interface CreateTeamInterface {
    body: Partial<Team>;
}

export interface UpdateTeamInterface extends CreateTeamInterface {
    teamId: number;
}

export interface TeamClassification {
    id?: number;
    created?: string;
    modified?: string;
    targetKeywords?: string | null;
    avoidanceKeywords?: string | null;
    category?: string | null;
    geography?: string | null;
    language?: string | null;
    autoClassify?: boolean;
    teamUid: string;
}

export interface CompetitorResponse {
    competitorName: string;
    competitorUrl: string;
    active?: boolean;
}

export interface BulkUpdateCompetitorsInterface {
    competitors: {
        name: string;
        url: string;
    }[];
    teamUid: string;
}

export type TeamResponse = ConvertToSnakeCase<Team>;

export interface SeedKeywords {
    id: number;
    created: string;
    modified: string;
    keyword: string;
    searchVolume: number;
    team: number;
}

export interface BroadKeywordBody {
    keywords: string[];
    contentStrategyId: number;
    database: string;
    limit: number;
}

export interface ListTeamRequestParams {
    teamType?: TeamType;
}

export interface TeamPerformanceRequestParams {
    teamUid: string;
}
