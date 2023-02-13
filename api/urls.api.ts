export const apiUrls = {
    // Authentication
    LOGIN: 'login/',
    SIGNUP: 'signup/',
    COMPLETE_OAUTH: 'complete-oauth/',
    // Teams
    TEAMS: 'teams/',
    TEAM: (id: number) => `teams/${id}/`,
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
    // Ahrefs
    AHREFS: '/ahrefs/report/',
    PROCESS_AHREFS_DATA: 'engine/process-ahrefs-data/',

}