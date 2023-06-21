import { baseApi } from "api/base-query";
import { LoginFormValues } from "forms/login";
import { SignupFormValues } from "forms/signup";
import { camelizeKeys, decamelizeKeys } from "humps";

import { authUrls } from "api/urls";
import { MagicTokenUrl } from "types";

interface LoginReturnProps {
    token: string;
}

interface SignupReturnProps {
    token: string;
}

interface OAuthReturnProps { }

interface OAuthProps {
    code: string;
    app: string;
}

interface SetPasswordRequestProps {
    token: string;
    password: string;
}

interface SetPasswordReturnProps {
    token: string;
}

interface CompleteSignupRequestProps {
    token: string;
    firstName: string;
    lastName: string;
    password: string;
}

interface CompleteSignupReturnProps extends SetPasswordReturnProps { }

const { LOGIN, SIGNUP, COMPLETE_OAUTH, SET_PASSWORD, GENERATE_MAGIC_TOKEN, COMPLETE_SIGNUP, VALIDATE_TOKEN } = authUrls;

// Define a service using a base URL and expected endpoints
export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginReturnProps, LoginFormValues>({
            query: (values) => ({
                url: LOGIN,
                method: "POST",
                body: { ...values },
            }),
        }),
        signup: builder.mutation<SignupReturnProps, SignupFormValues>({
            query: (values) => ({
                url: SIGNUP,
                method: "POST",
                body: { ...decamelizeKeys(values) },
            }),
        }),
        completeOauth: builder.mutation<OAuthReturnProps, OAuthProps>({
            query: (values) => ({
                url: COMPLETE_OAUTH,
                method: "POST",
                body: { ...values },
            }),
        }),
        setPassword: builder.mutation<SetPasswordReturnProps, SetPasswordRequestProps>({
            query: (values) => ({
                url: SET_PASSWORD,
                method: "POST",
                body: { ...decamelizeKeys(values) },
            }),
        }),
        /**
         * Generate a magic token
         */
        generateMagicToken: builder.mutation<MagicTokenUrl, { userId: number }>({
            query: (values) => ({
                url: GENERATE_MAGIC_TOKEN,
                method: "POST",
                body: decamelizeKeys(values),
            }),
            transformResponse: (response: MagicTokenUrl) => camelizeKeys(response) as MagicTokenUrl,
        }),
        /**
         * Complete signup
         */
        completeSignup: builder.mutation<CompleteSignupReturnProps, CompleteSignupRequestProps>({
            query: (values) => ({
                url: COMPLETE_SIGNUP,
                method: "POST",
                body: decamelizeKeys(values),
            })
        }),
        /**
         * Validate the auth token
         */
        validateToken: builder.mutation<undefined, void>({
            query: () => ({
                url: VALIDATE_TOKEN,
                method: "POST"
            })
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useLoginMutation,
    useSignupMutation,
    useCompleteOauthMutation,
    useSetPasswordMutation,
    useGenerateMagicTokenMutation,
    useCompleteSignupMutation,
    useValidateTokenMutation,
} = authApi;
