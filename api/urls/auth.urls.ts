export const authUrls = {
    LOGIN: 'login/',
    SIGNUP: 'signup/',
    COMPLETE_OAUTH: 'complete-oauth/',
    SET_PASSWORD: 'set-password/',
    AUTH_URL: (appName: string | null) => {
        if (appName) return `get-auth-url/?app=${appName}`;
        return 'get-auth-url/';
    },
    GENERATE_MAGIC_TOKEN: "generate-magic-token/",
    COMPLETE_SIGNUP: "complete-signup/",
    VALIDATE_TOKEN: "validate-token/"
}