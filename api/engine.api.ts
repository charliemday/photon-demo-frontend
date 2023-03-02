import { CompetitorInterface } from "forms/competitors";
import { decamelizeKeys } from "humps";
import { apiUrls, baseApi } from ".";

interface ProcessAhrefsDataBody extends FormData { }

interface PeopleAlsoAskBody extends FormData { }

export interface SeedKeywordsBody {
  teamId: string;
  competitors?: CompetitorInterface[];
  keywords: string[];
  classificationCategory?: string;
  positivePrompts?: string[];
  negativePrompts?: string[];
  database?: string; // TODO: Type this to the SEMRUSH_DATABASES
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
    peopleAlsoAsk: builder.mutation<undefined, PeopleAlsoAskBody>({
      query: (body) => ({
        url: apiUrls.PEOPLE_ALSO_ASK,
        method: "POST",
        body,
      })
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints

export const {
  useProcessAhrefsDataMutation,
  usePeopleAlsoAskMutation,
  useSeedKeywordsMutation,
} = engineApi;
