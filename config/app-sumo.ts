
export enum APPSUMO_PLAN_IDS {
    TIER1 = "wordseek_tier1",
    TIER2 = "wordseek_tier2",
    TIER3 = "wordseek_tier3",
}

export const APPSUMO_TIERS = [
    {
        name: "License Tier 1 ($49)",
        features: [
            "1 Workspace",
            "Lifetime access to WordSeek",
            "SEO on-page optimization",
            "Entire website per analysis (multiple-URLs)",
            "Analysis of unlimited URLs",
            "Connect Google Search Console"

        ],
        planId: APPSUMO_PLAN_IDS.TIER1
    },
    {
        name: "License Tier 2 ($119)",
        features: [
            "10 Workspaces",
            "Lifetime access to WordSeek",
            "SEO on-page optimization",
            "Entire website per analysis (multiple-URLs)",
            "Analysis of unlimited URLs",
            "Connect Google Search Console"

        ],
        planId: APPSUMO_PLAN_IDS.TIER2

    },
    {
        name: "License Tier 3 ($299)",
        features: [
            "Unlimited Workspaces",
            "Lifetime access to WordSeek",
            "SEO on-page optimization",
            "Entire website per analysis (multiple-URLs)",
            "Analysis of unlimited URLs",
            "Connect Google Search Console"

        ],
        planId: APPSUMO_PLAN_IDS.TIER3
    }
]