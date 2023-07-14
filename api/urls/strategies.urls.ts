export const strategiesUrls = {
    LIST_CREATE_CONTENT_STRATEGIES: (teamId: number) => `strategies/content-strategy/?team_id=${teamId}`,
    LIST_CREATE_SEED_KEYWORDS: (contentStrategyId: number) => `strategies/content-strategy/${contentStrategyId}/seed-keyword/`,
    RETRIEVE_UPDATE_DESTROY_CONTENT_STRATEGY: (contentStrategyId: number) => `strategies/content-strategy/${contentStrategyId}/`,
    RETRIEVE_UPDATE_DESTROY_SEED_KEYWORD: (contentStrategyId: number, seedKeywordId: number) => `strategies/content-strategy/${contentStrategyId}/seed-keyword/${seedKeywordId}/`,
    LIST_CREATE_COMPETITORS: (contentStrategyId: number) => `strategies/content-strategy/${contentStrategyId}/competitors/`,
    LIST_GEOGRAPHIES: 'strategies/geography/',
    GENERATE_COMPETITORS_KEYWORDS: (contentStrategyId: number) => `strategies/content-strategy/${contentStrategyId}/competitor-keywords`,
    GENERATE_CONTENT_STRATEGY: (contentStrategyId: number) => `strategies/content-strategy/${contentStrategyId}/generate`,
    BULK_DELETE_COMPETITORS: (contentStrategyId: number) => `strategies/content-strategy/${contentStrategyId}/competitors/bulk/delete`,
    BULK_DELETE_SEED_KEYWORDS: (contentStrategyId: number) => `strategies/content-strategy/${contentStrategyId}/seed-keywords/bulk/delete`,
    GENERATE_CONTENT_STRATEGY_PART_2_MANUAL: 'strategies/content-strategy/part-2/manual/generate',
};