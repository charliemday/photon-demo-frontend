import { createApi } from '@reduxjs/toolkit/query/react'

import { LoginFormValues } from 'forms/login';
import { SignupFormValues } from 'forms/signup';
import { decamelizeKeys } from 'humps';
import { baseQuery } from '.';

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

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery,
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
        })
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useSignupMutation, useCompleteOauthMutation } = authApi

