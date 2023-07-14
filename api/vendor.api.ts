import {
    AppSumoDetailsResponse,
    CompareConsoleData,
    GetAuthUrlRequest,
    GetAuthUrlResponse,
    GetSearchConsoleData,
    GetSearchConsolePagesRequest,
    GetSearchConsolePagesResponse,
    GetSearchConsoleResponse,
    GoogleClientResponse,
    SearchConsoleSitesResponse
} from "api/types";
import { authUrls, engineUrls, vendorUrls } from "api/urls";
import { camelizeKeys } from "humps";
import { ConvertToSnakeCase } from "types";
import { baseApi, TAG_TYPES } from ".";

const {
    APPSUMO_DETAILS,
    GOOGLE_SITES,
    GOOGLE_EXTERNAL_CLIENT,
    GOOGLE_INTERNAL_CLIENT,
    POPULATE_REPORTS,
} = vendorUrls;
const {
    MISSING_KEYWORDS,
} = engineUrls;

// Define a service using a base URL and expected endpoints
export const vendorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Fetches the Auth URL for a given OAuth App
         */
        getAuthUrl: builder.query<GetAuthUrlResponse, GetAuthUrlRequest>({
            query: ({ appName }) => ({
                url: authUrls.AUTH_URL(appName),
            }),
        }),
        /**
         * Get the search console sites the user has access to
         */
        getSearchConsoleSites: builder.query<string[], void | { teamUid: string | null }>({
            query: (args) => {
                if (args?.teamUid) {
                    return {
                        url: `${GOOGLE_SITES}?team_uid=${args.teamUid}`,
                    };
                }
                return {
                    url: GOOGLE_SITES,
                };
            },
            transformResponse: (response: SearchConsoleSitesResponse) => {
                const sites = response.siteEntry.map((site) => site.siteUrl);
                return sites;
            },
        }),
        // TODO: DEPRECATE
        createSearchConsoleReport: builder.mutation<GetSearchConsoleResponse, GetSearchConsoleData>({
            query: ({ domain, startDate, endDate, dimensions, notify, team }) => ({
                url: `/google/keyword-report?domain=${encodeURIComponent(
                    domain,
                )}&start_date=${startDate}&end_date=${endDate}&dimensions=${dimensions}&notify=${notify}&team=${team}`,
                method: "POST",
            }),
        }),
        compareSearchConsoleReport: builder.mutation<null, CompareConsoleData>({
            query: (data) => {
                let url = MISSING_KEYWORDS;
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
         * Populates search console reports for all sites
         */
        populateSearchConsoleReports: builder.mutation<null, null>({
            query: () => ({
                url: POPULATE_REPORTS,
                method: "POST",
            }),
        }),
        /**
         * Gets the Google External Client
         */
        getGoogleExternalClient: builder.query<GoogleClientResponse, null>({
            query: () => ({
                url: GOOGLE_EXTERNAL_CLIENT,
                method: "GET",
            }),
            transformResponse: (response: ConvertToSnakeCase<GoogleClientResponse>) =>
                camelizeKeys(response) as GoogleClientResponse,
        }),
        /**
         * Gets the Google Internal Client
         */
        getGoogleInternalClient: builder.query<GoogleClientResponse, null>({
            query: () => ({
                url: GOOGLE_INTERNAL_CLIENT,
                method: "GET",
            }),
            transformResponse: (response: ConvertToSnakeCase<GoogleClientResponse>) =>
                camelizeKeys(response) as GoogleClientResponse,
        }),
        /**
         * Gets the AppSumo Details for the User
         */
        getAppSumoDetails: builder.query<AppSumoDetailsResponse, void>({
            query: () => ({
                url: APPSUMO_DETAILS,
                method: "GET",
            }),
            transformResponse: (response: ConvertToSnakeCase<AppSumoDetailsResponse>) =>
                camelizeKeys(response) as AppSumoDetailsResponse,
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
    usePopulateSearchConsoleReportsMutation,
    useGetGoogleExternalClientQuery,
    useGetGoogleInternalClientQuery,
    useGetAppSumoDetailsQuery,
} = vendorApi;
