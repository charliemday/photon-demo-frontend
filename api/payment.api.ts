import { baseApi } from "api/base-query";
import { apiUrls } from "api/urls.api";
import { decamelizeKeys } from "humps";


export interface CheckoutQueryParams {
    priceId: string;
    successUrl: string;
    cancelUrl: string;
}

export interface CheckoutResponse {
    url: string;
}

export interface CheckoutVerifyResponse {
    message: string;
}

export interface CreateCustomerPortalBody {
    returnUrl: string;
}

// Define a service using a base URL and expected endpoints
export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Get checkout url
         */
        getCheckoutUrl: builder.mutation<CheckoutResponse, CheckoutQueryParams>({
            query: (body) => ({
                url: apiUrls.STRIPE_CHECKOUT_URL,
                method: "POST",
                body: decamelizeKeys(body),
            }),
        }),
        /**
         * Verify payment
         */
        verifyPayment: builder.mutation<CheckoutResponse, undefined>({
            query: () => ({
                url: apiUrls.VERIFY,
                method: "POST",
            })

        }),
        /**
         * Create the Customer Portal
         */
        createCustomerPortal: builder.mutation<CheckoutResponse, CreateCustomerPortalBody>({
            query: (body) => ({
                url: apiUrls.CUSTOMER_PORTAL,
                method: "POST",
                body: decamelizeKeys(body),
            })
        })

    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCheckoutUrlMutation, useVerifyPaymentMutation, useCreateCustomerPortalMutation } = paymentApi;
