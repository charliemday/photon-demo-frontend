
import { baseApi } from 'api/base-query';
import { LoginFormValues } from 'forms/login';
import { SignupFormValues } from 'forms/signup';
import { decamelizeKeys } from 'humps';

import { apiUrls } from 'api/urls.api';

interface LoginReturnProps {
    token: string;
};

interface SignupReturnProps {
    token: string;
};

interface OAuthReturnProps { }

interface OAuthProps {
    code: string;
    app: string;
}

interface SetPasswordRequestProps {
    token: string;
    password: string;
}

interface SetPasswordReturnProps { }

// Define a service using a base URL and expected endpoints
export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginReturnProps, LoginFormValues>({
            query: (values) => ({
                url: apiUrls.LOGIN,
                method: 'POST',
                body: { ...values },
            })
        }),
        signup: builder.mutation<SignupReturnProps, SignupFormValues>({
            query: (values) => ({
                url: apiUrls.SIGNUP,
                method: 'POST',
                body: { ...decamelizeKeys(values) },
            }),
        }),
        completeOauth: builder.mutation<OAuthReturnProps, OAuthProps>({
            query: (values) => ({
                url: apiUrls.COMPLETE_OAUTH,
                method: 'POST',
                body: { ...values },
            })
        }),
        setPassword: builder.mutation<SetPasswordReturnProps, SetPasswordRequestProps>({
            query: (values) => ({
                url: apiUrls.SET_PASSWORD,
                method: 'POST',
                body: { ...decamelizeKeys(values) }
            })
        })
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useSignupMutation, useCompleteOauthMutation, useSetPasswordMutation } = authApi

