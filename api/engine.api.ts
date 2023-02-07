import { baseApi, apiUrls } from ".";

interface ProcessAhrefsDataBody extends FormData { }

interface PeopleAlsoAskBody extends FormData { }

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
  usePeopleAlsoAskMutation
} = engineApi;
