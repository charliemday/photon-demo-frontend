import { camelizeKeys, decamelizeKeys } from "humps";
import { APIErrorResponse, ConvertToSnakeCase, Team, TeamType } from "types";
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

interface BroadKeywordBody {
  keywords: string[];
  contentStrategyId: number;
  database: string;
  limit: number;
}

interface ListTeamRequestParams {
  teamType?: TeamType;
}

// Define a service using a base URL and expected endpoints
export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * List teams
     */
    listTeams: builder.query<Team[], ListTeamRequestParams>({
      query: ({
        teamType
      }) => ({
        url: apiUrls.TEAMS(teamType),
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
        url: apiUrls.TEAMS(),
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
        url: apiUrls.TEAM_COMPETITORS_BULK,
        method: "PATCH",
        body: decamelizeKeys(body)
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
  useBulkCreateSeedKeywordsMutation,
  useBulkUpdateCompetitorsMutation,
  useGenerateBroadKeywordsMutation
} = teamApi;
