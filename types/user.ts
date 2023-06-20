export enum Features_DEPRECATED {
    /**
     * DEPRECATED: WordSeek old feature flag
     */
    WORD_SEEK = "word_seek",
    /**
     * The user can access the standard Word Seek
     */
    WORD_SEEK_FREE = "word_seek_free",
    /**
     * The user can access the premium Word Seek
     */
    WORD_SEEK_PREMIUM = "word_seek_premium",
    /**
     * The user can access their performance dashboard
    **/
    PERFORMANCE_DASHBOARD = "performance_dashboard",
    /**
     * The user can access and run their own content strategies
     */
    CONTENT_STRATEGY_WIZARD = "content_strategy_wizard",
    /**
     * The user can access everything
     */
    ALL = "*",
    /**
     * The user can create a single workspace
     */
    WORKSPACE_ONE = "1_workspace",
    /**
     * The user can create a maximum of five workspaces
     */
    WORKSPACE_FIVE = "5_workspaces",
    /**
     * The user can create a maximum of ten workspaces
     */
    WORKSPACE_TEN = "10_workspaces",
    /**
     * The user can create unlimited workspaces
    */
    WORKSPACE_UNLIMITED = "unlimited_workspaces",
}


export enum FeatureKeys {
    WORKSPACES = "workspaces",
    PAGES_PER_WORKSPACE = "pagesPerWorkspace",
    WORD_SEEK_PREMIUM = "wordSeekPremium",
}

export interface Features {
    [FeatureKeys.WORKSPACES]: number;
    [FeatureKeys.PAGES_PER_WORKSPACE]: number;
    [FeatureKeys.WORD_SEEK_PREMIUM]: boolean;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    /**
     * Whether we should hide the tools for the user
     */
    hideTools?: boolean;
    /**
     * Their onboarding state
     */
    onboardingStep?: number;
    /**
     * Whether they have connected their search console
     */
    connectedSearchConsole?: boolean;
    /**
     * Is the user a member of staff?
     */
    isStaff?: boolean;
    /**
     * Products the user has access to
     */
    products: {
        [key: string]: string[];
    }
    /**
     * Features the user has access to
     */
    features: Features;
}

export interface UserTier {
    id: number;
    tier: {
        id: number;
        created: string;
        modified: string;
        name: string;
        tier: number;
        description: string;
        featureAccess: Features;
    };
    created: string;
    modified: string;
    user: number;
}
export interface UserMin {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

export interface MagicTokenUrl {
    id: number;
    magicUrl: string;
    created: string;
    modified: string;
    token: string;
    active: boolean;
    user: number;
}