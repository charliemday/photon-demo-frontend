import { camelizeKeys, decamelizeKeys } from "humps";
import { ConvertToSnakeCase, User, UserMin, UserTier } from "types";

import { userUrls } from "api/urls";
import { baseApi, TAG_TYPES } from ".";

type UserDetailsReturnProps = ConvertToSnakeCase<User>;

interface UpdateOnboardingStepRequest {
  onboardingStep: number;
}

const { USER, ONBOARDING_STEP, FEEDBACK, TIER, LIST_USERS } = userUrls;

// Define a service using a base URL and expected endpoints
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get the user's details
     */
    userDetails: builder.query<User, undefined>({
      query: () => ({
        url: USER,
      }),
      providesTags: [TAG_TYPES.USERS],
      transformResponse: (response: UserDetailsReturnProps) => camelizeKeys(response) as User,
    }),
    /**
     * Update the user's onboarding step
     */
    updateOnboardingStep: builder.mutation<undefined, UpdateOnboardingStepRequest>({
      query: (body) => ({
        url: ONBOARDING_STEP,
        method: "PATCH",
        body: decamelizeKeys(body),
      }),
      invalidatesTags: [TAG_TYPES.USERS],
    }),
    /**
     * Delete the user's account
     */
    deleteAccount: builder.mutation<undefined, undefined>({
      query: () => ({
        url: USER,
        method: "DELETE",
      }),
    }),
    /**
     * Submit feedback
     */
    submitFeedback: builder.mutation<undefined, { feedback: string }>({
      query: (body) => ({
        url: FEEDBACK,
        method: "POST",
        body: decamelizeKeys(body),
      }),
    }),
    /**
     * Get the user's tiers
     */
    userTiers: builder.query<UserTier, void>({
      query: () => ({
        url: TIER,
      }),
      transformResponse: (response: ConvertToSnakeCase<UserTier>) =>
        camelizeKeys(response) as UserTier,
    }),
    /**
     * List all users
     */
    listUsers: builder.query<UserMin[], void>({
      query: () => ({
        url: LIST_USERS,
      }),
      transformResponse: (response: ConvertToSnakeCase<UserMin[]>) =>
        camelizeKeys(response) as UserMin[],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useUserDetailsQuery,
  useUpdateOnboardingStepMutation,
  useDeleteAccountMutation,
  useSubmitFeedbackMutation,
  useUserTiersQuery,
  useListUsersQuery,
} = userApi;
