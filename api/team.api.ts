import { camelizeKeys, decamelizeKeys } from "humps";
import { APIErrorResponse, Team, TeamPerformance } from "types";
import { baseApi, TAG_TYPES } from ".";

import {
  BroadKeywordBody,
  BulkUpdateCompetitorsInterface,
  CompetitorResponse,
  CreateTeamInterface,
  ListTeamRequestParams,
  SeedKeywords,
  TeamPerformanceRequestParams,
  TeamResponse,
  UpdateTeamInterface
} from "api/types";
import { TeamMember } from "types/team";
import { apiUrls } from ".";
import { teamUrls } from "./urls";

const { TEAMS, TEAM, TEAM_PERFORMANCE, TEAM_MEMBERS, TEAM_COMPETITORS_BULK } = teamUrls;

// Define a service using a base URL and expected endpoints
export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * List teams
     */
    listTeams: builder.query<Team[], ListTeamRequestParams>({
      query: ({ teamType }) => ({
        url: TEAMS(teamType),
      }),
      providesTags: [TAG_TYPES.TEAMS],
      transformResponse: (response: TeamResponse[]) => response.map((t) => camelizeKeys(t) as Team),
    }),
    /**
     * Create a team
     */
    createTeam: builder.mutation<Team | APIErrorResponse, CreateTeamInterface>({
      query: ({ body }) => ({
        url: TEAMS(),
        method: "POST",
        body,
      }),
      invalidatesTags: [TAG_TYPES.TEAMS],
      transformResponse: (response: TeamResponse) => camelizeKeys(response) as Team,
    }),
    /**
     * Update a team
     */
    updateTeam: builder.mutation<Team, UpdateTeamInterface>({
      query: ({ teamId, body }) => ({
        url: TEAM(teamId),
        method: "PATCH",
        body: decamelizeKeys(body),
      }),
      invalidatesTags: [TAG_TYPES.TEAMS],
      transformResponse: (response: TeamResponse) => camelizeKeys(response) as Team,
    }),
    /**
     * Delete a team
     */
    deleteTeam: builder.mutation<Team, number>({
      query: (teamId) => ({
        url: TEAM(teamId),
        method: "DELETE",
      }),
      invalidatesTags: [TAG_TYPES.TEAMS],
    }),
    /**
     * Bulk create seed keywords for a team
     */
    // TODO: Remove
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
     * Bulk Update the team's competitors
     */
    // TODO: Remove
    bulkUpdateCompetitors: builder.mutation<CompetitorResponse[], BulkUpdateCompetitorsInterface>({
      query: (body) => ({
        url: TEAM_COMPETITORS_BULK,
        method: "PATCH",
        body: decamelizeKeys(body),
      }),
    }),
    /**
     * Run keywords through Broad Keyword API
     */
    // TODO: This is the "new" version we've been using (e.g. Step 1.2)
    generateBroadKeywords: builder.mutation<undefined, BroadKeywordBody>({
      query: (body) => ({
        url: apiUrls.BROAD_KEYWORD_API,
        method: "POST",
        body: decamelizeKeys(body),
      }),
    }),
    /**
     * Get a team's performance
     */
    teamPerformance: builder.query<TeamPerformance, TeamPerformanceRequestParams>({
      query: ({ teamUid }) => ({
        url: TEAM_PERFORMANCE(teamUid),
      }),
      transformResponse: (response: TeamPerformance) => camelizeKeys(response) as TeamPerformance,
    }),
    /**
     * List team members
     */
    teamMembers: builder.query<TeamMember[], { teamId: number }>({
      query: ({ teamId }) => ({
        url: TEAM_MEMBERS(teamId),
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useListTeamsQuery,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useCreateTeamMutation,
  useBulkCreateSeedKeywordsMutation,
  useBulkUpdateCompetitorsMutation,
  useGenerateBroadKeywordsMutation,
  useTeamPerformanceQuery,
  useTeamMembersQuery,
} = teamApi;
