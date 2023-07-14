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