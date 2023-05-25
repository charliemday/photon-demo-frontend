export enum Features {
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
    features: Features[];
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
        featureAccess: Features[];
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