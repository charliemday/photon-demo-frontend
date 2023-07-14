import { CompetitorInterface } from "forms/competitors";
import { SeedKeyword } from "types";



export interface ListContentStrategiesRequest {
    teamId: number;
}

export interface ListCreateSeedKeywordsRequest {
    contentStrategyId: number;
}

export interface CreateSeedKeywordRequest {
    contentStrategyId: number;
    body: {
        keyword?: Partial<SeedKeyword>;
        keywords?: Partial<SeedKeyword>[];
    }
}

export interface CreateContentStrategyRequest {
    teamId: number;
    body: {
        name: string;
    }
}

export interface CreateCompetitorsRequest {
    contentStrategyId: number;
    body: CompetitorInterface | CompetitorInterface[];
}
