import { CompetitorInterface } from "forms/competitors";
import { ExistingContent, Faq, Team, User, WordSeekItem, WordSeekJobType } from "types";

export interface GenerateFaqsResponse {
    data: {
        faqs: Faq[];
        existing: ExistingContent[];
    }
}

export interface GenerateFaqsQueryParams {
    teamId: number;
    resultId: number;
}


export interface PeopleAlsoAskBody extends FormData { }
export interface SeedKeywordsBody {
    /**
     * The ID of the team to which the keywords belong
     */
    teamId: string;
    /**
     * Optional list of competitors to use for keyword research
     */
    competitors?: CompetitorInterface[];
    /**
     * Optional list of keywords to use for keyword research
     */
    keywords?: string[];
    classificationCategory?: string;
    positivePrompts?: string[];
    negativePrompts?: string[];
    /**
     * The SEMRUSH database to use for keyword research
     */
    database?: string; // TODO: Type this to the SEMRUSH_DATABASES
    /**
     * Number of broad keywords to generate when creating clusters
     */
    limit?: number;
    /**
     * The maximum number of themes to return
     */
    max_themes?: number;
    /**
     * The max position to return
     */
    maxPosition?: number;
    /**
     * The max number of organic results to return
    §*/
    maxOrganicResults?: number;
}


export interface GenerateKIInputBody {
    contentStrategyId: number;
    keywords: string[];
    limit?: number;
    topPercentage?: number;
    database?: string; // TODO: Type this to the SEMRUSH_DATABASES
}

export interface GenerateSeedKeywordsBody {
    contentStrategyId: number;
    maxOrganicResults?: number;
    maxPosition?: number;
    database?: string; // TODO: Type this to the SEMRUSH_DATABASES
}

export interface CreateKeywordsThemesBody { teamId: string, themes: string[] }

export interface KeywordTheme {
    /**
     * The keyword theme
     */
    theme: string;
    /**
     * The number of times it appears in the dataset
     */
    volume: number;
}

export interface WordSeekBody {
    /**
     * The ID of the team to which the keywords belong
     */
    teamId: number;
    /**
     * The page to run the WordSeek process on
     */
    pages: string[];
    /**
     * The site to run the WordSeek process on
     */
    site: string;
}

export interface WordSeekResultsResponse {
    success?: boolean;
    data: WordSeekItem[];
}


export interface KeywordItem {
    keyword: string;
    search_volume: number;
}


export interface KeywordInsightsResult {
    id: number;
    hub: string;
    // TODO: Humps doesn't support depth options and we don't want to corrupt
    // the format of the keywords
    hub_data: {
        [key: string]: {
            [key: string]: KeywordItem[];
        }
    },
}

export interface KeywordInsightsOrder {
    contentStrategy: number;
    id: number;
    sheetsUrl: string;
    status: string;
    orderId: string;
}

export interface KeywordInsightsResultsRequest {
    orderId: number;
}

export interface CreateKeywordInsightsOrderBody {
    contentStrategyId: number;
    orderId?: string;
    sheetsUrl?: string;
    status?: string;
}

export interface WordSeekJobsResponse {
    progress: number;
    jobsRemaining: number; //WordSeekJob[];
    jobsCompleted: number; //WordSeekJob[];
    user: Partial<User>;
    jobType: WordSeekJobType;
    jobCreated: string;
    site: string;
    jobGroupUuid: string;
    team: Team;
}