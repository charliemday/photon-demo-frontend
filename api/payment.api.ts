import { baseApi } from "api/base-query";
import { CheckoutQueryParams, CheckoutResponse, CreateCustomerPortalBody } from "api/types";
import { paymentUrls } from "api/urls";
import { decamelizeKeys } from "humps";

const { STRIPE_CHECKOUT_URL, VERIFY, CUSTOMER_PORTAL } = paymentUrls;

// Define a service using a base URL and expected endpoints
export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Get checkout url (unused for now as we used the Stripe embedded checkout)
         */
        getCheckoutUrl: builder.mutation<CheckoutResponse, CheckoutQueryParams>({
            query: (body) => ({
                url: STRIPE_CHECKOUT_URL,
                method: "POST",
                body: decamelizeKeys(body),
            }),
        }),
        /**
         * Verify payment
         */
        verifyPayment: builder.mutation<CheckoutResponse, undefined>({
            query: () => ({
                url: VERIFY,
                method: "POST",
            }),
        }),
        /**
         * Create the Customer Portal
         */
        createCustomerPortal: builder.mutation<CheckoutResponse, CreateCustomerPortalBody>({
            query: (body) => ({
                url: CUSTOMER_PORTAL,
                method: "POST",
                body: decamelizeKeys(body),
            }),
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetCheckoutUrlMutation,
    useVerifyPaymentMutation,
    useCreateCustomerPortalMutation,
} = paymentApi;
