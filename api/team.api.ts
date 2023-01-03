import { camelizeKeys } from "humps";
import { APIErrorResponse, ConvertToSnakeCase, Team } from "types";
import { baseApi, TAG_TYPES } from ".";

interface CreateTeamInterface {
  body: Partial<Team>;
}

interface UpdateTeamInterface extends CreateTeamInterface {
  teamId: number;
}

type TeamResponse = ConvertToSnakeCase<Team>;

// Define a service using a base URL and expected endpoints
export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTeams: builder.query<Team[], undefined>({
      query: () => ({
        url: "teams/",
      }),
      providesTags: [TAG_TYPES.TEAMS],
      transformResponse: (response: TeamResponse[]) =>
        response.map((t) => camelizeKeys(t) as Team),
    }),
    createTeam: builder.mutation<Team | APIErrorResponse, CreateTeamInterface>({
      query: ({ body }) => ({
        url: "teams/",
        method: "POST",
        body,
      }),
      invalidatesTags: [TAG_TYPES.TEAMS],
      transformResponse: (response: TeamResponse) =>
        camelizeKeys(response) as Team,
    }),
    updateTeam: builder.mutation<Team, UpdateTeamInterface>({
      query: ({ teamId, body }) => ({
        url: `teams/${teamId}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [TAG_TYPES.TEAMS],
      transformResponse: (response: TeamResponse) =>
        camelizeKeys(response) as Team,
    }),
    deleteTeam: builder.mutation<Team, number>({
      query: (teamId) => ({
        url: `teams/${teamId}/`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_TYPES.TEAMS],
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
} = teamApi;
