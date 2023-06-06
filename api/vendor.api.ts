import { authUrls, vendorUrls } from "api/urls";
import { camelizeKeys } from "humps";
import { ConvertToSnakeCase, User } from "types";
import { apiUrls, baseApi, TAG_TYPES } from ".";
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

const { APPSUMO_DETAILS } = vendorUrls;

// Define a service using a base URL and expected endpoints
export const vendorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAuthUrl: builder.query<GetAuthUrlResponse, GetAuthUrlRequest>({
            query: ({ appName }) => ({
                url: authUrls.AUTH_URL(appName)
            }),
        }),
        /**
         * Gets the sites for a given domain
         */
        getSearchConsoleSites: builder.query<string[], {
            teamUid: string
        }>({
            query: ({
                teamUid
            }) => apiUrls.GOOGLE_SITES(teamUid),
            transformResponse: (response: SearchConsoleSitesResponse) => {
                const sites = response.siteEntry.map((site) => site.siteUrl);
                return sites;
            },
        }),
        // TODO: DEPRECATE
        createSearchConsoleReport: builder.mutation<
            GetSearchConsoleResponse,
            GetSearchConsoleData
        >({
            query: ({ domain, startDate, endDate, dimensions, notify, team }) => ({
                url: `/google/keyword-report?domain=${encodeURIComponent(
                    domain
                )}&start_date=${startDate}&end_date=${endDate}&dimensions=${dimensions}&notify=${notify}&team=${team}`,
                method: "POST",
            }),
        }),
        compareSearchConsoleReport: builder.mutation<null, CompareConsoleData>({
            query: (data) => {
                let url = apiUrls.MISSING_KEYWORDS;
                if (data.teamIds) {
                    url = url + `?team_ids=[${data.teamIds.join(",")}]`;
                }

                return {
                    url,
                    method: "GET",
                };
            },
        }),
        /**
         * Gets the pages for a given domain
         */
        getSearchConsolePages: builder.query<
            GetSearchConsolePagesResponse,
            GetSearchConsolePagesRequest
        >({
            query: ({ domain, teamUid }) => ({
                url: `/google/pages?domain=${encodeURIComponent(domain)}&team_uid=${teamUid}`,
            }),
            providesTags: [TAG_TYPES.GOOGLE],
            transformResponse: (response: { pages: string[] | string }) => {
                if (typeof response.pages === "string") {
                    return {
                        pages: JSON.parse(response.pages),
                    };
                }
                return response;
            },
        }),
        /**
         * Uploads ahrefs report to the server
         */
        uploadAhrefsReport: builder.mutation<null, AhrefsRequestData>({
            query: (data) => ({
                url: apiUrls.AHREFS,
                method: "POST",
                body: data,
            }),
        }),
        /**
         * Populates search console reports for all sites
         */
        populateSearchConsoleReports: builder.mutation<null, null>({
            query: () => ({
                url: apiUrls.POPULATE_REPORTS,
                method: "POST",
            }),
        }),
        /**
         * Gets the Google External Client
         */
        getGoogleExternalClient: builder.query<GoogleClientResponse, null>({
            query: () => ({
                url: apiUrls.GOOGLE_EXTERNAL_CLIENT,
                method: "GET",
            }),
            transformResponse: (response: ConvertToSnakeCase<GoogleClientResponse>) => camelizeKeys(response) as GoogleClientResponse,
        }),
        /**
         * Gets the Google Internal Client
         */
        getGoogleInternalClient: builder.query<GoogleClientResponse, null>({
            query: () => ({
                url: apiUrls.GOOGLE_INTERNAL_CLIENT,
                method: "GET",
            }),
            transformResponse: (response: ConvertToSnakeCase<GoogleClientResponse>) => camelizeKeys(response) as GoogleClientResponse,
        }),
        /**
         * Gets the AppSumo Details for the User
         */
        getAppSumoDetails: builder.query<AppSumoDetailsResponse, void>({
            query: () => ({
                url: APPSUMO_DETAILS,
                method: "GET",
            }),
            transformResponse: (response: ConvertToSnakeCase<AppSumoDetailsResponse>) => camelizeKeys(response) as AppSumoDetailsResponse,
        })
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetAuthUrlQuery,
    useCreateSearchConsoleReportMutation,
    useGetSearchConsoleSitesQuery,
    useCompareSearchConsoleReportMutation,
    useGetSearchConsolePagesQuery,
    useUploadAhrefsReportMutation,
    usePopulateSearchConsoleReportsMutation,
    useGetGoogleExternalClientQuery,
    useGetGoogleInternalClientQuery,
    useGetAppSumoDetailsQuery
} = vendorApi;
