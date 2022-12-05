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
}