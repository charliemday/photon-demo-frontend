import { TeamType } from "types";

export const teamUrls = {
    TEAMS: (teamType?: TeamType) => `teams/${teamType ? `?team_type=${teamType}` : ''}`,
    TEAM: (id: number) => `teams/team/${id}/`,
    TEAM_PERFORMANCE: (teamUid: string) => `teams/performance/weekly?team_uid=${teamUid}`,
    TEAM_MEMBERS: (teamId: number) => `teams/team/${teamId}/members`,
};