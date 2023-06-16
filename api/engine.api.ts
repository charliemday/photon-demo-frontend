import {
  CreateKeywordInsightsOrderBody,
  GenerateFaqsQueryParams,
  GenerateFaqsResponse,
  GenerateKIInputBody,
  GenerateSeedKeywordsBody,
  KeywordInsightsOrder,
  KeywordInsightsResult,
  KeywordInsightsResultsRequest,
  PeopleAlsoAskBody,
  SeedKeywordsBody,
  WordSeekBody,
  WordSeekJobsResponse,
  WordSeekResultsResponse
} from "api/types";
import { camelizeKeys, decamelizeKeys } from "humps";
import { ConvertToSnakeCase, WordSeekItem, WordSeekJob } from "types";
import { apiUrls, baseApi } from ".";

// Define a service using a base URL and expected endpoints
export const engineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * API for uploading the Ahrefs CSV
     */

    // // TODO: This might be the "unused" endpoint (keyword-research)
    seedKeywords: builder.mutation<undefined, SeedKeywordsBody>({
      query: (body) => ({
        url: apiUrls.SEED_KEYWORDS,
        method: "POST",
        body: decamelizeKeys(body),
      }),
    }),
    // Old Version (e.g. Step 1.1)
    generateSeedKeywords: builder.mutation<undefined, GenerateSeedKeywordsBody>({
      query: (body) => ({
        url: apiUrls.GENERATE_SEED_KEYWORDS,
        method: "POST",
        body: decamelizeKeys(body),
      }),
    }),
    peopleAlsoAsk: builder.mutation<undefined, PeopleAlsoAskBody>({
      query: (body) => ({
        url: apiUrls.PEOPLE_ALSO_ASK,
        method: "POST",
        body,
      }),
    }),
    /**
     * Runs both the Seed Keywords and PAA steps (Step 1 + 2)
     */
    generateKIInput: builder.mutation<undefined, GenerateKIInputBody>({
      query: (body) => ({
        url: apiUrls.GENERATE_KI_INPUT,
        method: "POST",
        body: decamelizeKeys(body),
      }),
    }),
    /**
     * Runs the WordSeek process
     */
    wordSeek: builder.mutation<undefined, WordSeekBody>({
      query: (body) => ({
        url: apiUrls.WORD_SEEK,
        method: "POST",
        body: decamelizeKeys(body),
      }),
    }),
    /**
     * Fetches the WordSeek results
     */
    wordSeekResults: builder.query<
      WordSeekItem[],
      { teamUid: string; jobGroupUuid?: string | null }
    >({
      query: ({ teamUid, jobGroupUuid }) => ({
        url: apiUrls.WORD_SEEK_RESULTS(teamUid, jobGroupUuid),
      }),
      transformResponse: (response: ConvertToSnakeCase<WordSeekResultsResponse>) => {
        if (response.success) {
          return camelizeKeys(response.data) as WordSeekItem[];
        }
        return [];
      },
    }),
    /**
     * Fetches the Keyword Insights results
     */
    keywordInsightsResults: builder.query<KeywordInsightsResult[], KeywordInsightsResultsRequest>({
      query: ({ orderId }) => ({
        url: apiUrls.KEYWORD_INSIGHTS_RESULTS(orderId),
      }),
      // transformResponse: (response: ConvertToSnakeCase<KeywordInsightsResult[]>) => camelizeKeys(response) as KeywordInsightsResult[]
    }),
    /**
     * Creates the Keyword Insights Order
     */
    createKeywordInsightOrder: builder.mutation<
      KeywordInsightsOrder,
      CreateKeywordInsightsOrderBody
    >({
      query: (body) => ({
        url: apiUrls.CREATE_KEYWORD_INSIGHTS_ORDER,
        method: "POST",
        body: decamelizeKeys(body),
      }),
      transformResponse: (response: ConvertToSnakeCase<KeywordInsightsOrder>) =>
        camelizeKeys(response) as KeywordInsightsOrder,
    }),
    /**
     * Fetch the Keyword Insights output
     */
    keywordInsightsOrder: builder.query<KeywordInsightsOrder[], number>({
      query: (contentStrategyId) => ({
        url: apiUrls.KEYWORD_INSIGHTS_ORDER(contentStrategyId),
      }),
      transformResponse: (response: ConvertToSnakeCase<KeywordInsightsOrder[]>) =>
        camelizeKeys(response) as KeywordInsightsOrder[],
    }),
    /**
     * Fetches the Word Seek Jobs
     */
    wordSeekJobs: builder.query<WordSeekJobsResponse[], { teamId: number | undefined } | void>({
      query: (body) => ({
        url: apiUrls.WORD_SEEK_JOBS(body?.teamId || undefined),
      }),
      transformResponse: (response: ConvertToSnakeCase<WordSeekJobsResponse[]>) =>
        response.map((job) => camelizeKeys(job)) as WordSeekJobsResponse[],
    }),
    /**
     * Triggers a single word seek job to be re-run
     */
    reRunWordSeekJob: builder.mutation<
      WordSeekJob,
      {
        jobGroupUuid: string;
      }
    >({
      query: (body) => ({
        url: apiUrls.WORD_SEEK_RESUME,
        body: decamelizeKeys(body),
        method: "POST",
      }),
    }),
    /**
     * Generates or fetches the latest FAQs
     */
    generateFaqs: builder.query<GenerateFaqsResponse, GenerateFaqsQueryParams>({
      query: ({ teamId, resultId }) => ({
        url: apiUrls.GENERATE_FAQS(teamId, resultId),
        transformResponse: (response: ConvertToSnakeCase<GenerateFaqsResponse>) =>
          camelizeKeys(response) as GenerateFaqsResponse,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints

export const {
  usePeopleAlsoAskMutation,
  useSeedKeywordsMutation,
  useGenerateSeedKeywordsMutation,
  useGenerateKIInputMutation,
  useWordSeekMutation,
  useWordSeekResultsQuery,
  useKeywordInsightsResultsQuery,
  useKeywordInsightsOrderQuery,
  useCreateKeywordInsightOrderMutation,
  useWordSeekJobsQuery,
  useReRunWordSeekJobMutation,
  useGenerateFaqsQuery,
} = engineApi;
