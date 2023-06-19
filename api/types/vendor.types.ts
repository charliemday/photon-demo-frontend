import { User } from "types";

export interface GetAuthUrlRequest {
    appName: string | null;
}

export interface GetAuthUrlResponse {
    url: string;
}

export interface GetSearchConsoleData {
    domain: string;
    startDate: string;
    endDate: string;
    dimensions?: string[];
    /**
     * Whether to send the report to the team
     */
    notify?: "true" | undefined;
    /**
     * Team ID to save the report to. Optional,
     * if omitted the report will not be saved
     */
    team?: number;
}

export interface GetSearchConsoleResponse { }

export interface SearchConsoleSite {
    siteUrl: string;
    permissionLevel: string;
}

export interface SearchConsoleSitesResponse {
    siteEntry: SearchConsoleSite[];
}

export interface CompareConsoleData {
    teamIds?: number[];
}

export interface GetSearchConsolePagesRequest {
    domain: string;
    teamUid: string;
}

export interface GetSearchConsolePagesResponse {
    pages: string[];
}

export interface AhrefsRequestData extends FormData { }

export interface GoogleClientResponse {
    name: string;
    slug: string;
    clientId: string;
}

export interface AppSumoDetailsResponse {
    user: Partial<User>;
    planId: string;
    invoiceItemUuid: string;
}