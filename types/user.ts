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
}