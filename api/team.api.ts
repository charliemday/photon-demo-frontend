import { camelizeKeys, decamelizeKeys } from "humps";
import { APIErrorResponse, ConvertToSnakeCase, Team } from "types";
import { baseApi, TAG_TYPES } from ".";

import { apiUrls } from "api/urls.api";

interface CreateTeamInterface {
  body: Partial<Team>;
}

interface UpdateTeamInterface extends CreateTeamInterface {
  teamId: number;
}

export interface TeamClassification {
  id?: number;
  created?: string;
  modified?: string;
  targetKeywords?: string | null;
  avoidanceKeywords?: string | null;
  category?: string | null;
  geography?: string | null;
  language?: string | null;
  autoClassify?: boolean;
  teamUid: string;
}

interface CompetitorResponse {
  competitorName: string;
  competitorUrl: string;
  active?: boolean;
}

export interface BulkUpdateCompetitorsInterface {
  competitors: {
    name: string;
    url: string;
  }[];
  teamUid: string;
}

type TeamResponse = ConvertToSnakeCase<Team>;

export interface SeedKeywords {
  id: number;
  created: string;
  modified: string;
  keyword: string;
  searchVolume: number;
  team: number;
}

// Define a service using a base URL and expected endpoints
export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * List teams
     */
    listTeams: builder.query<Team[], undefined>({
      query: () => ({
        url: apiUrls.TEAMS,
      }),
      providesTags: [TAG_TYPES.TEAMS],
      transformResponse: (response: TeamResponse[]) =>
        response.map((t) => camelizeKeys(t) as Team),
    }),
    /**
     * Create a team
     */
    createTeam: builder.mutation<Team | APIErrorResponse, CreateTeamInterface>({
      query: ({ body }) => ({
        url: apiUrls.TEAMS,
        method: "POST",
        body,
      }),
      invalidatesTags: [TAG_TYPES.TEAMS],
      transformResponse: (response: TeamResponse) =>
        camelizeKeys(response) as Team,
    }),
    /**
     * Update a team
     */
    updateTeam: builder.mutation<Team, UpdateTeamInterface>({
      query: ({ teamId, body }) => ({
        url: apiUrls.TEAM(teamId),
        method: "PATCH",
        body,
      }),
      invalidatesTags: [TAG_TYPES.TEAMS],
      transformResponse: (response: TeamResponse) =>
        camelizeKeys(response) as Team,
    }),
    /**
     * Delete a team
     */
    deleteTeam: builder.mutation<Team, number>({
      query: (teamId) => ({
        url: apiUrls.TEAM(teamId),
        method: "DELETE",
      }),
      invalidatesTags: [TAG_TYPES.TEAMS],
    }),
    /**
     * Retrieve team classification
     */
    retrieveClassification: builder.query<TeamClassification, string>({
      query: (teamUid) => ({
        url: apiUrls.TEAM_CLASSIFICATION(teamUid),
      }),
      transformResponse: (response: ConvertToSnakeCase<TeamClassification>) => {
        return camelizeKeys(response) as TeamClassification;
      },
    }),
    /**
     * Update team classification
     */
    updateClassifications: builder.mutation<
      TeamClassification,
      TeamClassification
    >({
      query: (body) => ({
        url: apiUrls.TEAM_CLASSIFICATION(body.teamUid),
        method: "PATCH",
        body: decamelizeKeys(body),
      }),
    }),
    /**
     * List competitors for a team
     */
    teamCompetitors: builder.query<CompetitorResponse[], string>({
      query: (teamId) => ({
        url: apiUrls.TEAM_COMPETITORS(teamId),
      }),
      providesTags: [TAG_TYPES.TEAMS],
      transformResponse: (response: ConvertToSnakeCase<CompetitorResponse>[]) =>
        response.map((c) => camelizeKeys(c) as CompetitorResponse).filter((c) => c.active),
    }),
    /**
     * List seed keywords for a team
     */
    listSeedKeywords: builder.query<SeedKeywords[], string>({
      query: (teamUid) => ({
        url: apiUrls.TEAM_SEED_KEYWORDS(teamUid),
      }),
      providesTags: [TAG_TYPES.TEAMS],
      transformResponse: (response: ConvertToSnakeCase<SeedKeywords>[]) =>
        response.map((c) => camelizeKeys(c) as SeedKeywords),
    }),
    /**
     * Bulk create seed keywords for a team
     */
    bulkCreateSeedKeywords: builder.mutation<
      SeedKeywords[],
      { teamUid: string; keywords: string[] }
    >({
      query: (body) => ({
        url: apiUrls.BULK_CREATE_SEED_KEYWORDS,
        method: "POST",
        body: decamelizeKeys(body),
      }),
      invalidatesTags: [TAG_TYPES.TEAMS],
    }),
    /**
     * Create competitors for a team
     */
    createCompetitors: builder.mutation<
      CompetitorResponse[],
      {
        competitorName: string;
        competitorUrl: string;
        team: number;
      }[]
    >({
      query: (body) => ({
        url: apiUrls.TEAM_COMPETITORS(),
        method: "POST",
        body: decamelizeKeys(body),
      }),
      invalidatesTags: [TAG_TYPES.TEAMS],
    }),
    /**
     * Bulk Update the team's competitors
     */
    bulkUpdateCompetitors: builder.mutation<CompetitorResponse[], BulkUpdateCompetitorsInterface>({
      query: (body) => ({
        url: apiUrls.TEAM_COMPETITORS_BULK,
        method: "PATCH",
        body: decamelizeKeys(body)
      }),
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useListTeamsQuery,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useCreateTeamMutation,
  useRetrieveClassificationQuery,
  useTeamCompetitorsQuery,
  useUpdateClassificationsMutation,
  useListSeedKeywordsQuery,
  useBulkCreateSeedKeywordsMutation,
  useCreateCompetitorsMutation,
  useBulkUpdateCompetitorsMutation
} = teamApi;
