import { TeamType } from "types";

export const teamUrls = {
    TEAMS: (teamType?: TeamType) => `teams/${teamType ? `?team_type=${teamType}` : ''}`,
    TEAM: (id: number) => `teams/team/${id}/`,
    TEAM_PERFORMANCE: (teamUid: string) => `teams/performance/weekly?team_uid=${teamUid}`,
    TEAM_MEMBERS: (teamId: number) => `teams/team/${teamId}/members`,
    // TODO: Remove
    TEAM_CLASSIFICATION: (teamUid: string) => `teams/team/${teamUid}/classifications`, // TODO: DEPRECATE
    TEAM_COMPETITORS: (teamUid?: string) => `teams/team/competitors${teamUid ? `?team_uid=${teamUid}` : ''}`, // TODO: DEPRECATE
    TEAM_COMPETITORS_BULK: "teams/team/competitors/bulk-update", // TODO: DEPRECATE
    TEAM_SEED_KEYWORDS: (teamUid: string) => `teams/team/${teamUid}/seed-keywords`, // TODO: DEPRECATE
};