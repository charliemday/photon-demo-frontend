import { TeamType } from "types";

// TODO: Place these in their own folders with their RTK endpoints
export const apiUrls = {
    // Authentication
    LOGIN: 'login/',
    SIGNUP: 'signup/',
    COMPLETE_OAUTH: 'complete-oauth/',
    // Teams
    TEAMS: (teamType?: TeamType) => `teams/${teamType ? `?team_type=${teamType}` : ''}`,
    TEAM: (id: number) => `teams/${id}/`,
    TEAM_CLASSIFICATION: (teamUid: string) => `teams/team/${teamUid}/classifications`,
    TEAM_COMPETITORS: (teamUid?: string) => `teams/team/competitors${teamUid ? `?team_uid=${teamUid}` : ''}`,
    TEAM_COMPETITORS_BULK: "teams/team/competitors/bulk-update",
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
    GOOGLE_SITES: (teamUid: string) => `google/sites?team_uid=${teamUid}`,
    POPULATE_REPORTS: 'google/populate-reports',
    GOOGLE_EXTERNAL_CLIENT: "google/clients/external",
    GOOGLE_INTERNAL_CLIENT: "google/clients/internal",
    // WordSeek
    WORD_SEEK: 'engine/word-seek/',
    WORD_SEEK_RESULTS: (teamUid: string) => `/engine/word-seek/results?team_uid=${teamUid}`,
    // Engine
    MISSING_KEYWORDS: 'engine/missing-keywords-job',
    PEOPLE_ALSO_ASK: 'engine/people-also-ask/',
    SEED_KEYWORDS: 'engine/keyword-research/',
    CLUSTER_KEYWORDS: 'engine/cluster-keywords/',
    KEYWORD_THEMES: (teamUid?: string) => `engine/keyword-themes${teamUid ? `?team_uid=${teamUid}` : '/'}`,
    GENERATE_SEED_KEYWORDS: 'engine/generate-seed-keywords/',
    BULK_CREATE_SEED_KEYWORDS: 'engine/bulk-create-seed-keywords/',
    BROAD_KEYWORD_API: 'engine/generate-broad-keywords/',
    GENERATE_KI_INPUT: 'engine/generate-ki-input/',
    // Ahrefs
    AHREFS: '/ahrefs/report/',
    PROCESS_AHREFS_DATA: 'engine/process-ahrefs-data/',
    // Payment
    STRIPE_CHECKOUT_URL: 'payments/stripe/checkout-url',
    VERIFY: 'payments/stripe/verify',
    CUSTOMER_PORTAL: 'payments/stripe/customer-portal',
    // Keyword Insights
    KEYWORD_INSIGHTS_RESULTS: (orderId: number) => `engine/keyword-insights/results?&order_id=${orderId}`,
    CREATE_KEYWORD_INSIGHTS_ORDER: 'engine/keyword-insights/order/',
    KEYWORD_INSIGHTS_ORDER: (contentStrategyId: number) => `engine/keyword-insights/order?content_strategy_id=${contentStrategyId}`,
    // Blogs
    LIST_TEAM_BLOGS: (teamId: number) => `blogs?team_id=${teamId}`,
    LIST_BLOG_SECTIONS: (blogId: number) => `blogs/${blogId}/sections`,
    UPDATE_BLOG: (blogId: number) => `blogs/${blogId}/`,
    GENERATE_BLOG_OUTLINES: `blogs/generate-sections/`,
    DELETE_BLOG: (blogId: number) => `blogs/${blogId}/`,
    // Content Strategies
    LIST_CREATE_CONTENT_STRATEGIES: (teamId: number) => `strategies/content-strategy/?team_id=${teamId}`,
    LIST_CREATE_SEED_KEYWORDS: (contentStrategyId: number) => `strategies/content-strategy/${contentStrategyId}/seed-keyword/`,
    RETRIEVE_UPDATE_DESTROY_CONTENT_STRATEGY: (contentStrategyId: number) => `strategies/content-strategy/${contentStrategyId}/`,
    RETRIEVE_UPDATE_DESTROY_SEED_KEYWORD: (contentStrategyId: number, seedKeywordId: number) => `strategies/content-strategy/${contentStrategyId}/seed-keyword/${seedKeywordId}/`,
    LIST_CREATE_COMPETITORS: (contentStrategyId: number) => `strategies/content-strategy/${contentStrategyId}/competitors/`,
    LIST_GEOGRAPHIES: 'strategies/geography/',
    GENERATE_COMPETITORS_KEYWORDS: (contentStrategyId: number) => `strategies/content-strategy/${contentStrategyId}/competitor-keywords`,
    GENERATE_CONTENT_STRATEGY: (contentStrategyId: number) => `strategies/content-strategy/${contentStrategyId}/generate`,
};