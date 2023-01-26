import { baseApi } from ".";

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
}

export interface GetSearchConsolePagesResponse {
    pages: string[];
}

export interface AhrefsRequestData extends FormData { }

// Define a service using a base URL and expected endpoints
export const vendorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAuthUrl: builder.query<GetAuthUrlResponse, GetAuthUrlRequest>({
            query: ({ appName }) => ({
                url: appName ? `/get-auth-url?app=${appName}` : "/get-auth-url",
            }),
        }),
        getSearchConsoleSites: builder.query<string[], undefined>({
            query: () => "/google/sites",
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
                let url = "/missing-keywords-job";
                if (data.teamIds) {
                    url = url + `?team_ids=[${data.teamIds.join(",")}]`;
                }

                return {
                    url,
                    method: "GET",
                };
            },
        }),
        getSearchConsolePages: builder.query<
            GetSearchConsolePagesResponse,
            GetSearchConsolePagesRequest
        >({
            query: ({ domain }) => ({
                url: `/google/pages?domain=${encodeURIComponent(domain)}`,
            }),
            transformResponse: (response: { pages: string[] | string }) => {
                if (typeof response.pages === "string") {
                    return {
                        pages: JSON.parse(response.pages),
                    };
                }
                return response;
            },
        }),
        uploadAhrefsReport: builder.mutation<null, AhrefsRequestData>({
            query: (data) => ({
                url: "/ahrefs/report/",
                method: "POST",
                body: data,
            }),
        }),
        populateSearchConsoleReports: builder.mutation<null, null>({
            query: (data) => ({
                url: "/google/populate-reports",
                method: "POST",
            }),
        }),
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
} = vendorApi;
