import { camelizeKeys, decamelizeKeys } from "humps";
import { ConvertToSnakeCase, User } from "types";

import { baseApi, TAG_TYPES } from ".";
import { apiUrls } from "api/urls.api";

type UserDetailsReturnProps = ConvertToSnakeCase<User>;

interface UpdateOnboardingStepRequest {
  onboardingStep: number;
}

// Define a service using a base URL and expected endpoints
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userDetails: builder.query<User, undefined>({
      query: () => ({
        url: apiUrls.USER,
      }),
      providesTags: [TAG_TYPES.USERS],
      transformResponse: (response: UserDetailsReturnProps) =>
        camelizeKeys(response) as User,
    }),
    updateOnboardingStep: builder.mutation<undefined, UpdateOnboardingStepRequest>({
      query: (body) => ({
        url: apiUrls.ONBOARDING_STEP,
        method: "PATCH",
        body: decamelizeKeys(body),
      }),
      invalidatesTags: [TAG_TYPES.USERS],
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useUserDetailsQuery, useUpdateOnboardingStepMutation } = userApi;
