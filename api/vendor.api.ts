import { baseApi } from ".";

export interface GetAuthUrlRequest {
    appName: string | null;
}

export interface GetAuthUrlResponse {
    url: string;
}

// Define a service using a base URL and expected endpoints
export const vendorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAuthUrl: builder.query<GetAuthUrlResponse, GetAuthUrlRequest>({
            query: ({ appName }) => ({
                url: appName ? `/get-auth-url?app=${appName}` : "/get-auth-url",
            }),
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAuthUrlQuery } = vendorApi;
