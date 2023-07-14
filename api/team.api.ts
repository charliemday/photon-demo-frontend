import { camelizeKeys, decamelizeKeys } from "humps";
import { APIErrorResponse, Team, TeamPerformance } from "types";
import { baseApi, TAG_TYPES } from ".";

import {
  BroadKeywordBody, CreateTeamInterface,
  ListTeamRequestParams, TeamPerformanceRequestParams,
  TeamResponse,
  UpdateTeamInterface
} from "api/types";
import { TeamMember } from "types/team";
import { engineUrls, teamUrls } from "./urls";

const { TEAMS, TEAM, TEAM_PERFORMANCE, TEAM_MEMBERS } = teamUrls;
const {
  BROAD_KEYWORD_API,
} = engineUrls;

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
        body: decamelizeKeys(body),
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
     * Run keywords through Broad Keyword API
     */
    generateBroadKeywords: builder.mutation<undefined, BroadKeywordBody>({
      query: (body) => ({
        url: BROAD_KEYWORD_API,
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
  useGenerateBroadKeywordsMutation,
  useTeamPerformanceQuery,
  useTeamMembersQuery,
} = teamApi;
