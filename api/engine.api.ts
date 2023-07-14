import {
  CreateKeywordInsightsOrderBody,
  GenerateFaqsQueryParams,
  GenerateFaqsResponse,
  GenerateInsertQueriesBody,
  GenerateInsertQueriesResponse,
  GenerateKIInputBody,
  GenerateSeedKeywordsBody,
  KeywordInsightsOrder,
  KeywordInsightsResult,
  KeywordInsightsResultsRequest,
  PeopleAlsoAskBody,
  SimilarKeywordsBody,
  SimilarKeywordsQueryParams,
  SimilarKeywordsResponse,
  UpdateMisspelledKeywordsBody,
  WordSeekBody,
  WordSeekResultsResponse
} from "api/types";
import { engineUrls } from "api/urls";
import { camelizeKeys, decamelizeKeys } from "humps";
import { ConvertToSnakeCase, WordSeekItem, WordSeekJob } from "types";
import { baseApi } from ".";
import { InsertQuery, SimilarKeywords } from "./types/engine.types";

const {
  GENERATE_SEED_KEYWORDS,
  PEOPLE_ALSO_ASK,
  GENERATE_KI_INPUT,
  WORD_SEEK,
  WORD_SEEK_RESULTS,
  KEYWORD_INSIGHTS_RESULTS,
  CREATE_KEYWORD_INSIGHTS_ORDER,
  KEYWORD_INSIGHTS_ORDER,
  WORD_SEEK_JOBS,
  WORD_SEEK_RESUME,
  GENERATE_FAQS,
  FIND_SIMILAR_KEYWORDS,
  RETRIEVE_SIMILAR_KEYWORDS,
  UPDATE_MISSPELLED_KEYWORDS,
  GENERATE_INSERT_QUERIES,
  RETRIEVE_INSERT_QUERY,
} = engineUrls;

// Define a service using a base URL and expected endpoints
export const engineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * API for uploading the Ahrefs CSV
     */
    // Old Version (e.g. Step 1.1)
    generateSeedKeywords: builder.mutation<undefined, GenerateSeedKeywordsBody>({
      query: (body) => ({
        url: GENERATE_SEED_KEYWORDS,
        method: "POST",
        body: decamelizeKeys(body),
      }),
    }),
    peopleAlsoAsk: builder.mutation<undefined, PeopleAlsoAskBody>({
      query: (body) => ({
        url: PEOPLE_ALSO_ASK,
        method: "POST",
        body,
      }),
    }),
    /**
     * Runs both the Seed Keywords and PAA steps (Step 1 + 2)
     */
    generateKIInput: builder.mutation<undefined, GenerateKIInputBody>({
      query: (body) => ({
        url: GENERATE_KI_INPUT,
        method: "POST",
        body: decamelizeKeys(body),
      }),
    }),
    /**
     * Runs the WordSeek process
     */
    wordSeek: builder.mutation<undefined, WordSeekBody>({
      query: (body) => ({
        url: WORD_SEEK,
        method: "POST",
        body: decamelizeKeys(body),
      }),
    }),
    /**
     * Fetches the WordSeek results
     */
    wordSeekResults: builder.query<WordSeekItem[], { teamId: number; jobGroup?: number | null }>({
      query: ({ teamId, jobGroup }) => ({
        url: WORD_SEEK_RESULTS(teamId, jobGroup),
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
        url: KEYWORD_INSIGHTS_RESULTS(orderId),
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
        url: CREATE_KEYWORD_INSIGHTS_ORDER,
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
        url: KEYWORD_INSIGHTS_ORDER(contentStrategyId),
      }),
      transformResponse: (response: ConvertToSnakeCase<KeywordInsightsOrder[]>) =>
        camelizeKeys(response) as KeywordInsightsOrder[],
    }),
    /**
     * Fetches the Word Seek Jobs
     */
    wordSeekJobs: builder.query<WordSeekJob[], { teamId: number | undefined } | void>({
      query: (body) => ({
        url: WORD_SEEK_JOBS(body?.teamId || undefined),
      }),
      transformResponse: (response: ConvertToSnakeCase<WordSeekJob[]>) =>
        response.map((job) => camelizeKeys(job)) as WordSeekJob[],
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
        url: WORD_SEEK_RESUME,
        body: decamelizeKeys(body),
        method: "POST",
      }),
    }),
    /**
     * Generates or fetches the latest FAQs
     */
    generateFaqs: builder.query<GenerateFaqsResponse, GenerateFaqsQueryParams>({
      query: ({ teamId, resultId }) => ({
        url: GENERATE_FAQS(teamId, resultId),
        transformResponse: (response: ConvertToSnakeCase<GenerateFaqsResponse>) =>
          camelizeKeys(response) as GenerateFaqsResponse,
      }),
    }),
    /**
     * Generates the similar queries for a given keyword
     */
    findSimilarKeywords: builder.mutation<SimilarKeywordsResponse, SimilarKeywordsBody>({
      query: (body) => ({
        url: FIND_SIMILAR_KEYWORDS,
        body: decamelizeKeys(body),
        method: "POST",
      }),
      transformResponse: (response: ConvertToSnakeCase<SimilarKeywordsResponse>) =>
        camelizeKeys(response) as SimilarKeywordsResponse,
    }),
    /**
     * Retrieves the similar keywords
     */
    retrieveSimilarKeywords: builder.query<SimilarKeywords, SimilarKeywordsQueryParams>({
      query: ({ similarKeywordsId }) => ({
        url: RETRIEVE_SIMILAR_KEYWORDS(similarKeywordsId),
      }),
      transformResponse: (response: ConvertToSnakeCase<SimilarKeywords>) =>
        camelizeKeys(response) as SimilarKeywords,
    }),
    /**
     * Updates misspelled keywords
     */
    updateMisspelledKeywords: builder.mutation<undefined, UpdateMisspelledKeywordsBody>({
      query: (body) => ({
        url: UPDATE_MISSPELLED_KEYWORDS,
        body: decamelizeKeys(body),
        method: "POST",
      }),
    }),
    /**
     * Generates insert queries
     */
    generateInsertQueries: builder.mutation<
      GenerateInsertQueriesResponse,
      GenerateInsertQueriesBody
    >({
      query: (body) => ({
        url: GENERATE_INSERT_QUERIES,
        method: "POST",
        body: decamelizeKeys(body),
      }),
      transformResponse: (response: ConvertToSnakeCase<GenerateInsertQueriesResponse>) =>
        camelizeKeys(response) as GenerateInsertQueriesResponse,
    }),
    /**
     * Retrieves an insert query
     */
    retrieveInsertQuery: builder.query<InsertQuery, { insertQueryId: number }>({
      query: ({ insertQueryId }) => ({
        url: RETRIEVE_INSERT_QUERY(insertQueryId),
      }),
      transformResponse: (response: ConvertToSnakeCase<InsertQuery>) =>
        camelizeKeys(response) as InsertQuery,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints

export const {
  usePeopleAlsoAskMutation,
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
  useFindSimilarKeywordsMutation,
  useRetrieveSimilarKeywordsQuery,
  useUpdateMisspelledKeywordsMutation,
  useGenerateInsertQueriesMutation,
  useRetrieveInsertQueryQuery,
} = engineApi;
