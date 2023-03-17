import { CompetitorInterface } from "forms/competitors";
import { decamelizeKeys } from "humps";
import { apiUrls, baseApi } from ".";

interface ProcessAhrefsDataBody extends FormData { }

interface PeopleAlsoAskBody extends FormData { }

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
  teamId: number;
  keywords: string[];
  limit?: number;
  topPercentage?: number;
  database?: string; // TODO: Type this to the SEMRUSH_DATABASES
}

export interface GenerateSeedKeywordsBody {
  teamId: string;
  classify?: boolean;
  maxOrganicResults?: number;
  maxPosition?: number;
  database?: string; // TODO: Type this to the SEMRUSH_DATABASES
  useCompetitors?: boolean;
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

// Define a service using a base URL and expected endpoints
export const engineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    processAhrefsData: builder.mutation<undefined, ProcessAhrefsDataBody>({
      query: (body) => ({
        url: apiUrls.PROCESS_AHREFS_DATA,
        method: "POST",
        body,
      })
    }),
    seedKeywords: builder.mutation<undefined, SeedKeywordsBody>({
      query: (body) => ({
        url: apiUrls.SEED_KEYWORDS,
        method: "POST",
        body: decamelizeKeys(body),
      })
    }),
    // New Endpoint
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
    clusterKeywords: builder.mutation<undefined, SeedKeywordsBody>({
      query: (body) => ({
        url: apiUrls.CLUSTER_KEYWORDS,
        method: "POST",
        body: decamelizeKeys(body),
      })
    }),
    listKeywordThemes: builder.query<KeywordTheme[], string>({
      query: (teamUid) => ({
        url: apiUrls.KEYWORD_THEMES(teamUid),
      })
    }),
    createKeywordThemes: builder.mutation<undefined, CreateKeywordsThemesBody>({
      query: ({ teamId, themes }) => ({
        url: apiUrls.KEYWORD_THEMES(),
        method: "POST",
        body: decamelizeKeys({ themes, teamId }),
      })
    }),
    /**
     * Runs both the Seed Keywords and PAA steps
     */
    generateKIInput: builder.mutation<undefined, GenerateKIInputBody>({
      query: (body) => ({
        url: apiUrls.GENERATE_KI_INPUT,
        method: "POST",
        body: decamelizeKeys(body),
      })
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints

export const {
  useProcessAhrefsDataMutation,
  usePeopleAlsoAskMutation,
  useClusterKeywordsMutation,
  useListKeywordThemesQuery,
  useCreateKeywordThemesMutation,
  useSeedKeywordsMutation,
  useGenerateSeedKeywordsMutation,
  useGenerateKIInputMutation
} = engineApi;
