import { baseApi } from "api/base-query";
import { apiUrls } from "api/urls.api";
import { CompetitorInterface } from "forms/competitors";
import { camelizeKeys, decamelizeKeys } from "humps";
import { ContentStrategy, ConvertToSnakeCase, Geography, SeedKeyword } from "types";


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


// Define a service using a base URL and expected endpoints
export const strategiesApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        /**
         * List all the Content Strategies for a particular team
         */
        listContentStrategies: builder.query<ContentStrategy[], ListContentStrategiesRequest>({
            query: (body) => ({
                url: apiUrls.LIST_CREATE_CONTENT_STRATEGIES(body.teamId),
            }),
            transformResponse: (response: ConvertToSnakeCase<ContentStrategy[]>) => camelizeKeys(response) as ContentStrategy[]
        }),
        /**
         * List all the seed keywords for a particular content strategy
         */
        listSeedKeywords: builder.query<SeedKeyword[], ListCreateSeedKeywordsRequest>({
            query: (body) => ({
                url: apiUrls.LIST_CREATE_SEED_KEYWORDS(body.contentStrategyId),
            }),
            transformResponse: (response: ConvertToSnakeCase<SeedKeyword[]>) => camelizeKeys(response) as SeedKeyword[]
        }),
        /**
         * Create a new content strategy
         */
        createContentStrategy: builder.mutation<ContentStrategy, CreateContentStrategyRequest>({
            query: ({ teamId, body }) => ({
                url: apiUrls.LIST_CREATE_CONTENT_STRATEGIES(teamId),
                method: "POST",
                body: decamelizeKeys(body)
            }),
            transformResponse: (response: ConvertToSnakeCase<ContentStrategy>) => camelizeKeys(response) as ContentStrategy
        }),
        /**
         * Create a new seed keyword
         **/
        createSeedKeyword: builder.mutation<SeedKeyword, CreateSeedKeywordRequest>({
            query: ({ contentStrategyId, body }) => ({
                url: apiUrls.LIST_CREATE_SEED_KEYWORDS(contentStrategyId),
                method: "POST",
                body: decamelizeKeys(body)
            })
        }),
        /**
         * Create a competitor
         **/
        createCompetitors: builder.mutation<CompetitorInterface, CreateCompetitorsRequest>({
            query: ({ contentStrategyId, body }) => ({
                url: apiUrls.LIST_CREATE_COMPETITORS(contentStrategyId),
                method: "POST",
                body: decamelizeKeys(body)
            })
        }),
        /**
         * List all competitors of a content strategy
         */
        listCompetitors: builder.query<CompetitorInterface[], { contentStrategyId: number }>({
            query: ({ contentStrategyId }) => ({
                url: apiUrls.LIST_CREATE_COMPETITORS(contentStrategyId),
            }),
            transformResponse: (response: ConvertToSnakeCase<CompetitorInterface[]>) => camelizeKeys(response) as CompetitorInterface[]
        }),
        /**
         * Generate competitors keywords
         */
        generateCompetitorsKeywords: builder.mutation<CompetitorInterface[], { contentStrategyId: number }>({
            query: ({ contentStrategyId }) => ({
                url: apiUrls.GENERATE_COMPETITORS_KEYWORDS(contentStrategyId),
                method: "POST",
            }),
        }),
        /**
         * Update a Content Strategy
         */
        updateContentStrategy: builder.mutation<ContentStrategy, { id: number; body: Partial<ContentStrategy> }>({
            query: ({ id, body }) => ({
                url: apiUrls.RETRIEVE_UPDATE_DESTROY_CONTENT_STRATEGY(id),
                method: "PATCH",
                body: decamelizeKeys(body)
            }),
            transformResponse: (response: ConvertToSnakeCase<ContentStrategy>) => camelizeKeys(response) as ContentStrategy
        }),
        /**
         * List available Geographies
         */
        listGeographies: builder.query<Geography[], void>({
            query: () => ({
                url: apiUrls.LIST_GEOGRAPHIES,
            }),
        }),
        /**
         * Delete a Seed Keyword
         */
        deleteSeedKeyword: builder.mutation<void, { contentStrategyId: number, seedKeywordId: number }>({
            query: ({ contentStrategyId, seedKeywordId }) => ({
                url: apiUrls.RETRIEVE_UPDATE_DESTROY_SEED_KEYWORD(contentStrategyId, seedKeywordId),
                method: "DELETE",
            }),
        }),
        /**
         * Generate a Content Strategy
         */
        generateContentStrategy: builder.mutation<ContentStrategy, { contentStrategyId: number }>({
            query: ({ contentStrategyId }) => ({
                url: apiUrls.GENERATE_CONTENT_STRATEGY(contentStrategyId),
                method: "POST",
            }),
        }),
        /**
         * Bulk delete competitors
         */
        bulkDeleteCompetitors: builder.mutation<void, { contentStrategyId: number, competitors: number[] }>({
            query: ({ contentStrategyId, competitors }) => ({
                url: apiUrls.BULK_DELETE_COMPETITORS(contentStrategyId),
                method: "DELETE",
                body: {
                    competitors
                }
            }),
        }),
        /**
         * Bulk delete seed keywords
         */
        bulkDeleteSeedKeywords: builder.mutation<void, { contentStrategyId: number, seedKeywords: number[] }>({
            query: ({ contentStrategyId, seedKeywords }) => ({
                url: apiUrls.BULK_DELETE_SEED_KEYWORDS(contentStrategyId),
                method: "DELETE",
                body: {
                    keywords: seedKeywords
                }
            }),
        }),
        /**
         * Triggers the next step of the manual content strategy
         */
        generateContentStrategyPart2Manual: builder.mutation<void, { orderId: string }>({
            query: (body) => ({
                url: apiUrls.GENERATE_CONTENT_STRATEGY_PART_2_MANUAL,
                method: "POST",
                body: decamelizeKeys(body)
            }),
        }),
    })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useListContentStrategiesQuery,
    useListSeedKeywordsQuery,
    useCreateContentStrategyMutation,
    useCreateSeedKeywordMutation,
    useCreateCompetitorsMutation,
    useUpdateContentStrategyMutation,
    useListGeographiesQuery,
    useListCompetitorsQuery,
    useGenerateCompetitorsKeywordsMutation,
    useDeleteSeedKeywordMutation,
    useGenerateContentStrategyMutation,
    useBulkDeleteCompetitorsMutation,
    useBulkDeleteSeedKeywordsMutation,
    useGenerateContentStrategyPart2ManualMutation
} = strategiesApi;
