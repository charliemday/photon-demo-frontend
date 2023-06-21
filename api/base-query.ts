import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "config";
import { RootState } from "store/store";


const publicEndpoints = ["login", "signup", "setPassword"]

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {

    if (publicEndpoints.includes(endpoint)) {
      // If we're hitting a public endpoint, don't pass the token.
      return headers
    }

    // If we have a token set in state, let's assume that we should be passing it.
    const token = (getState() as RootState).auth.token
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
  USER_TOOLS = 'UserTools',
  GOOGLE = 'Google'
}



export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: Object.values(TAG_TYPES),
  endpoints: () => ({}),
});