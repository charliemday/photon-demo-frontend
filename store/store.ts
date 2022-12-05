import { configureStore, combineReducers, Reducer } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { resettableReducer } from "reduxsauce";

import { authReducer, teamReducer, territoryReducer } from "./slices";
import { authApi, baseApi, toolApi } from "api";
import { LOGOUT_ACTION } from "hooks/useLogout.hook";

const resettable = resettableReducer(LOGOUT_ACTION);

const persistConfig = {
  key: "root",
  storage,
};

const rootReducers: Reducer = combineReducers({
  auth: resettable(authReducer),
  team: resettable(teamReducer),
  territory: resettable(territoryReducer),
  [authApi.reducerPath]: authApi.reducer,
  [toolApi.reducerPath]: toolApi.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types as redux serializable check is not compatible with redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware, toolApi.middleware, baseApi.middleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
