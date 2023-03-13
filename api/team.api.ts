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
}

export interface SeedKeywords {
  keyword: string;
}

type TeamResponse = ConvertToSnakeCase<Team>;

// Define a service using a base URL and expected endpoints
export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTeams: builder.query<Team[], undefined>({
      query: () => ({
        url: apiUrls.TEAMS,
      }),
      providesTags: [TAG_TYPES.TEAMS],
      transformResponse: (response: TeamResponse[]) =>
        response.map((t) => camelizeKeys(t) as Team),
    }),
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
    deleteTeam: builder.mutation<Team, number>({
      query: (teamId) => ({
        url: apiUrls.TEAM(teamId),
        method: "DELETE",
      }),
      invalidatesTags: [TAG_TYPES.TEAMS],
    }),
    retrieveClassification: builder.query<TeamClassification, string>({
      query: (teamUid) => ({
        url: apiUrls.TEAM_CLASSIFICATION(teamUid),
      }),
      transformResponse: (response: ConvertToSnakeCase<TeamClassification>) => {
        return camelizeKeys(response) as TeamClassification;
      }
    }),
    updateClassifications: builder.mutation<TeamClassification, TeamClassification>({
      query: (body) => ({
        url: apiUrls.TEAM_CLASSIFICATION(body.teamUid),
        method: "PATCH",
        body: decamelizeKeys(body),
      })
    }),
    teamCompetitors: builder.query<CompetitorResponse[], string>({
      query: (teamId) => ({
        url: apiUrls.TEAM_COMPETITORS(teamId),
      }),
      transformResponse: (response: ConvertToSnakeCase<CompetitorResponse>[]) => response.map((c) => camelizeKeys(c) as CompetitorResponse),
    }),
    listSeedKeywords: builder.query<SeedKeywords[], string>({
      query: (teamUid) => ({
        url: apiUrls.TEAM_SEED_KEYWORDS(teamUid),
      }),
      transformResponse: (response: ConvertToSnakeCase<SeedKeywords>[]) => response.map((c) => camelizeKeys(c) as SeedKeywords),
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
  useRetrieveClassificationQuery,
  useTeamCompetitorsQuery,
  useUpdateClassificationsMutation,
  useListSeedKeywordsQuery,
} = teamApi;
