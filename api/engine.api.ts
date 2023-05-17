import { CompetitorInterface } from "forms/competitors";
import { camelizeKeys, decamelizeKeys } from "humps";
import { ConvertToSnakeCase, WordSeekItem } from "types";
import { apiUrls, baseApi } from ".";

interface ProcessAhrefsDataBody extends FormData { }

interface PeopleAlsoAskBody extends FormData { }

interface UploadKeywordInsightsOutputBody extends FormData { }

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
      })
    }),
    // Old Version (e.g. Step 1.1)
    generateSeedKeywords: builder.mutation<undefined, GenerateSeedKeywordsBody>({
      query: (body) => ({
        url: apiUrls.GENERATE_SEED_KEYWORDS,
        method: "POST",
        body: decamelizeKeys(body),
      })
    }),
    peopleAlsoAsk: builder.mutation<undefined, PeopleAlsoAskBody>({
      query: (body) => ({
        url: apiUrls.PEOPLE_ALSO_ASK,
        method: "POST",
        body,
      })
    }),
    /**
     * Runs both the Seed Keywords and PAA steps (Step 1 + 2)
     */
    generateKIInput: builder.mutation<undefined, GenerateKIInputBody>({
      query: (body) => ({
        url: apiUrls.GENERATE_KI_INPUT,
        method: "POST",
        body: decamelizeKeys(body),
      })
    }),
    /**
     * Runs the WordSeek process
     */
    wordSeek: builder.mutation<undefined, WordSeekBody>({
      query: (body) => ({
        url: apiUrls.WORD_SEEK,
        method: "POST",
        body: decamelizeKeys(body),
      })
    }),
    /**
     * Fetches the WordSeek results
     */
    wordSeekResults: builder.query<WordSeekItem[], string>({
      query: (teamUid) => ({
        url: apiUrls.WORD_SEEK_RESULTS(teamUid),
      }),
      transformResponse: (response: ConvertToSnakeCase<WordSeekResultsResponse>) => {
        if (response.success) {
          return camelizeKeys(response.data) as WordSeekItem[];
        }
        return [];
      }
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
    createKeywordInsightOrder: builder.mutation<KeywordInsightsOrder, CreateKeywordInsightsOrderBody>({
      query: (body) => ({
        url: apiUrls.CREATE_KEYWORD_INSIGHTS_ORDER,
        method: "POST",
        body: decamelizeKeys(body),
      }),
      transformResponse: (response: ConvertToSnakeCase<KeywordInsightsOrder>) => camelizeKeys(response) as KeywordInsightsOrder
    }),
    /**
     * Fetch the Keyword Insights output
     */
    keywordInsightsOrder: builder.query<KeywordInsightsOrder[], number>({
      query: (contentStrategyId) => ({
        url: apiUrls.KEYWORD_INSIGHTS_ORDER(contentStrategyId),
      }),
      transformResponse: (response: ConvertToSnakeCase<KeywordInsightsOrder[]>) => camelizeKeys(response) as KeywordInsightsOrder[]
    })
  })
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
  useCreateKeywordInsightOrderMutation
} = engineApi;
