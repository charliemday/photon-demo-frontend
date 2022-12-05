import { baseApi, TAG_TYPES } from "./base-query";
import { camelizeKeys, decamelizeKeys } from "humps";


interface Tool {
    name: string;
    description?: string;
    image?: string;
    created: string;
}

export enum RenewalCycleEnum {
    free = "free",
    monthly = "monthly",
    yearly = "yearly",
    "Free Trial" = "free_trial",
}


export interface ToolList extends Tool {
    id: number;
};

export interface UserToolList {
    id: number
    tool: ToolList;
    renewalDate: string;
    created: string;
    renewalCycle: RenewalCycleEnum;
    renewalAmount: number; // TODO: Will need to add currency
    nextRenewalDate: string | null;
}

export interface CreateUserToolBody {
    tool: number;
    renewalDate?: string;
    renewalCycle?: RenewalCycleEnum;
    renewalAmount?: number;
}

export interface PopulateToolsRequest {
    vendor: string;
};

export interface PopulateToolsResponse {
    data: UserToolList[];
};

export const toolApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        listTools: builder.query<ToolList[], undefined>({
            query: () => `tools/`,
            providesTags: [TAG_TYPES.TOOLS]
        }),
        createUserTool: builder.mutation<ToolList, CreateUserToolBody>({
            query: (body: CreateUserToolBody) => {
                return {
                    url: `user-tools/`,
                    method: 'POST',
                    body: decamelizeKeys(body)
                }
            },

            invalidatesTags: [TAG_TYPES.USER_TOOLS],
        }),
        listUserTools: builder.query<UserToolList[], undefined>({
            query: () => `user-tools/`,
            providesTags: [TAG_TYPES.USER_TOOLS],
            transformResponse: (response: UserToolList[]) =>
                response.map(t => camelizeKeys(t) as UserToolList)
        }),
        deleteUserTool: builder.mutation({
            query: (id: number) => ({
                url: `user-tools/${id}/`,
                method: 'DELETE'
            }),
            invalidatesTags: [TAG_TYPES.USER_TOOLS]
        }),
        populateToolsFromVendor: builder.mutation<PopulateToolsResponse, PopulateToolsRequest>({
            query: (body) => ({
                url: `populate-tools/`,
                method: 'POST',
                body
            }),
            invalidatesTags: [TAG_TYPES.USER_TOOLS, TAG_TYPES.TOOLS, TAG_TYPES.USERS]
        })
    })
});

export const {
    useListToolsQuery,
    useCreateUserToolMutation,
    useListUserToolsQuery,
    useDeleteUserToolMutation,
    usePopulateToolsFromVendorMutation
} = toolApi; 