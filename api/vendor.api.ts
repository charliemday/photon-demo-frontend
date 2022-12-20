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
}

export interface GetSearchConsoleResponse { }

export interface SearchConsoleSite {
    siteUrl: string;
    permissionLevel: string;
}

export interface SearchConsoleSitesResponse {
    siteEntry: SearchConsoleSite[];
}

// Define a service using a base URL and expected endpoints
export const vendorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAuthUrl: builder.query<GetAuthUrlResponse, GetAuthUrlRequest>({
            query: ({ appName }) => ({
                url: appName ? `/get-auth-url?app=${appName}` : "/get-auth-url",
            }),
        }),
        createSearchConsoleReport: builder.mutation<GetSearchConsoleResponse, GetSearchConsoleData>({
            query: ({ domain, startDate, endDate }) => ({
                url: `/google/keyword-report?domain=${encodeURIComponent(domain)}&start_date=${startDate}&end_date=${endDate}`,
                method: "POST",
            })
        }),
        getSearchConsoleSites: builder.query<string[], undefined>({
            query: () => "/google/sites",
            transformResponse: (response: SearchConsoleSitesResponse) => {
                const sites = response.siteEntry.map(site => site.siteUrl);
                return sites;
            }
        })
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAuthUrlQuery, useCreateSearchConsoleReportMutation, useGetSearchConsoleSitesQuery } = vendorApi;
