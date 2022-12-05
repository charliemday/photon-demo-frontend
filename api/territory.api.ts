import { camelizeKeys } from "humps";

import { Territory, ConvertToSnakeCase, Opportunity, Account } from "types";
import { baseApi, TAG_TYPES } from ".";

interface CreateTerritoryInterface {
  teamId: number;
  body: Partial<Territory>;
}

interface UpdateTerritoryInterface extends CreateTerritoryInterface {
  territoryId: number;
}

interface DeleteTerritoryInterface {
  territoryId: number;
  teamId: number;
}

interface ListAccountsInterface {
  teamId: number;
  territoryId: number;
}

interface CreateAccountInterface extends ListAccountsInterface {
  body: Partial<Account>;
}

interface UpdateAccountInterface extends CreateAccountInterface {
  accountId: number;
}

interface DeleteAccountInterface extends ListAccountsInterface {
  accountId: number;
}

interface ListOpportunitiesInterface extends ListAccountsInterface {
  accountId: number;
}

interface CreateOpportunityInterface extends ListOpportunitiesInterface {
  body: Partial<Opportunity>;
}

interface UpdateOpportunityInterface extends CreateOpportunityInterface {
  opportunityId: number;
}

interface DeleteOpportunityInterface extends ListOpportunitiesInterface {
  opportunityId: number;
}

type TerritoryResponse = ConvertToSnakeCase<Territory>;

type AccountResponse = ConvertToSnakeCase<Account>;

// Define a service using a base URL and expected endpoints
export const territoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTerritories: builder.query<Territory[], number>({
      query: (teamId) => `team/${teamId}/territories`,
      providesTags: [TAG_TYPES.TERRITORIES],
      transformResponse: (response: TerritoryResponse[]) =>
        response.map((t) => camelizeKeys(t) as Territory),
    }),
    createTerritory: builder.mutation<Territory, CreateTerritoryInterface>({
      query: ({ teamId, body }) => ({
        url: `team/${teamId}/territories/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [TAG_TYPES.TERRITORIES],
      transformResponse: (response: TerritoryResponse) =>
        camelizeKeys(response) as Territory,
    }),
    updateTerritory: builder.mutation<Territory, UpdateTerritoryInterface>({
      query: ({ teamId, territoryId, body }) => ({
        url: `team/${teamId}/territories/${territoryId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [TAG_TYPES.TERRITORIES],
      transformResponse: (response: TerritoryResponse) =>
        camelizeKeys(response) as Territory,
    }),
    deleteTerritory: builder.mutation<Territory, DeleteTerritoryInterface>({
      query: ({ teamId, territoryId }) => ({
        url: `team/${teamId}/territories/${territoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_TYPES.TERRITORIES],
    }),
    listAccounts: builder.query<Account[], ListAccountsInterface>({
      query: ({ teamId, territoryId }) =>
        `team/${teamId}/territories/${territoryId}/accounts`,
      providesTags: [TAG_TYPES.ACCOUNTS],
      transformResponse: (response: AccountResponse[]) =>
        response.map((a) => camelizeKeys(a) as Account),
    }),
    createAccount: builder.mutation<Account, CreateAccountInterface>({
      query: ({ teamId, territoryId, body }) => ({
        url: `team/${teamId}/territories/${territoryId}/accounts/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [TAG_TYPES.ACCOUNTS],
      transformResponse: (response: AccountResponse) =>
        camelizeKeys(response) as Account,
    }),
    updateAccount: builder.mutation<Account, UpdateAccountInterface>({
      query: ({ teamId, territoryId, accountId, body }) => ({
        url: `team/${teamId}/territories/${territoryId}/accounts/${accountId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [TAG_TYPES.ACCOUNTS],
      transformResponse: (response: AccountResponse) =>
        camelizeKeys(response) as Account,
    }),
    deleteAccount: builder.mutation<Account, DeleteAccountInterface>({
      query: ({ teamId, territoryId, accountId }) => ({
        url: `team/${teamId}/territories/${territoryId}/accounts/${accountId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_TYPES.ACCOUNTS],
    }),
    listOpporunities: builder.query<Opportunity[], ListOpportunitiesInterface>({
      query: ({ teamId, territoryId, accountId }) =>
        `team/${teamId}/territories/${territoryId}/accounts/${accountId}/opportunities`,
      transformResponse: (response: Opportunity[]) =>
        response.map((o) => camelizeKeys(o) as Opportunity),
      providesTags: [TAG_TYPES.OPPORTUNITIES],
    }),
    createOpportunity: builder.mutation<
      Opportunity,
      CreateOpportunityInterface
    >({
      query: ({ teamId, territoryId, accountId, body }) => ({
        url: `team/${teamId}/territories/${territoryId}/accounts/${accountId}/opportunities/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [TAG_TYPES.OPPORTUNITIES],
      transformResponse: (response: Opportunity) =>
        camelizeKeys(response) as Opportunity,
    }),
    updateOpportunity: builder.mutation<
      Opportunity,
      UpdateOpportunityInterface
    >({
      query: ({ teamId, territoryId, accountId, opportunityId, body }) => ({
        url: `team/${teamId}/territories/${territoryId}/accounts/${accountId}/opportunities/${opportunityId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [TAG_TYPES.OPPORTUNITIES],
      transformResponse: (response: Opportunity) =>
        camelizeKeys(response) as Opportunity,
    }),
    deleteOpportunity: builder.mutation<
      Opportunity,
      DeleteOpportunityInterface
    >({
      query: ({ teamId, territoryId, accountId, opportunityId }) => ({
        url: `team/${teamId}/territories/${territoryId}/accounts/${accountId}/opportunities/${opportunityId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_TYPES.OPPORTUNITIES],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints

export const {
  useListTerritoriesQuery,
  useCreateTerritoryMutation,
  useUpdateTerritoryMutation,
  useDeleteTerritoryMutation,
  useListAccountsQuery,
  useUpdateAccountMutation,
  useCreateAccountMutation,
  useDeleteAccountMutation,
  useListOpporunitiesQuery,
  useCreateOpportunityMutation,
  useUpdateOpportunityMutation,
  useDeleteOpportunityMutation,
} = territoryApi;
