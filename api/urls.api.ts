export const apiUrls = {
    // Authentication
    LOGIN: 'login/',
    SIGNUP: 'signup/',
    COMPLETE_OAUTH: 'complete-oauth/',
    // Teams
    TEAMS: 'teams/',
    TEAM: (id: number) => `teams/${id}/`,
    TEAM_CLASSIFICATION: (teamUid: string) => `teams/team/${teamUid}/classifications`,
    TEAM_COMPETITORS: (teamUid: string) => `teams/team/competitors?team_uid=${teamUid}`,
    TEAM_SEED_KEYWORDS: (teamUid: string) => `teams/team/${teamUid}/seed-keywords`,
    // User
    USER: 'user/',
    ONBOARDING_STEP: 'onboarding-step/',
    // Vendors
    AUTH_URL: (appName: string | null) => {
        if (appName) return `get-auth-url/?app=${appName}`;
        return 'get-auth-url/';
    },
    // Google
    GOOGLE_SITES: 'google-sites/',
    POPULATE_REPORTS: 'google/populate-reports',
    // Engine
    MISSING_KEYWORDS: 'engine/missing-keywords-job',
    PEOPLE_ALSO_ASK: 'engine/people-also-ask/',
    SEED_KEYWORDS: 'engine/keyword-research/',
    // Ahrefs
    AHREFS: '/ahrefs/report/',
    PROCESS_AHREFS_DATA: 'engine/process-ahrefs-data/',

}