import { createSlice } from "@reduxjs/toolkit";
import { strategiesApi } from "api";
import { ContentStrategy } from "types";

export interface StrategyState {
    activeContentStrategy: ContentStrategy | null;
}

const initialState: StrategyState = {
    activeContentStrategy: null,
};

export const strategySlice = createSlice({
    name: "strategy",
    initialState,
    reducers: {
        setActiveContentStrategy(state, action) {
            state.activeContentStrategy = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            strategiesApi.endpoints.listContentStrategies.matchFulfilled,
            (state, action) => {
                if (!state.activeContentStrategy) {
                    state.activeContentStrategy = action.payload[0];
                }
            }
        ),
            builder.addMatcher(
                strategiesApi.endpoints.createContentStrategy.matchFulfilled,
                (state, action) => {
                    if ("id" in action.payload) {
                        state.activeContentStrategy = action.payload;
                    }
                }
            );
    },
});

export const { setActiveContentStrategy } = strategySlice.actions;
export default strategySlice.reducer;
