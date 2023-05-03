import { baseApi } from "api/base-query";
import { apiUrls } from "api/urls.api";
import { CompetitorInterface } from "forms/competitors";
import { camelizeKeys, decamelizeKeys } from "humps";
import { ContentStrategy, ConvertToSnakeCase, SeedKeyword } from "types";


export interface ListContentStrategiesRequest {
    teamId: number;
}

export interface ListCreateSeedKeywordsRequest {
    contentStrategyId: number;
}

export interface CreateSeedKeywordRequest {
    contentStrategyId: number;
    body: {
        keyword: string;
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
         * Create a new seed keyword
         **/
        createCompetitors: builder.mutation<CompetitorInterface, CreateCompetitorsRequest>({
            query: ({ contentStrategyId, body }) => ({
                url: apiUrls.LIST_CREATE_COMPETITORS(contentStrategyId),
                method: "POST",
                body: decamelizeKeys(body)
            })
        })
    })

});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useListContentStrategiesQuery,
    useListSeedKeywordsQuery,
    useCreateContentStrategyMutation,
    useCreateSeedKeywordMutation,
    useCreateCompetitorsMutation
} = strategiesApi;
