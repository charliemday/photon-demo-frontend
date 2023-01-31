import { BASE_URL } from "config";
import { RootState } from "store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set('authorization', `Token ${token}`)
    }

    return headers
  },
});

export enum TAG_TYPES {
  ACCOUNTS = 'Accounts',
  ENGINE = 'Engine',
  OPPORTUNITIES = 'Opportunities',
  TEAMS = 'Teams',
  USERS = 'Users',
  TOOLS = 'Tools',
  USER_TOOLS = 'UserTools'
}


export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: Object.values(TAG_TYPES),
  endpoints: () => ({}),
});