import { createSlice } from "@reduxjs/toolkit";
import { strategiesApi } from "api";
import { ContentStrategy } from "types";

export interface StrategyState {
    activeContentStrategy: ContentStrategy | null;
    contentStrategies: ContentStrategy[];
}

const initialState: StrategyState = {
    activeContentStrategy: null,
    contentStrategies: [],
};

export const strategySlice = createSlice({
    name: "strategy",
    initialState,
    reducers: {
        setActiveContentStrategy(state, action) {
            state.activeContentStrategy = action.payload;
        },
        removeContentStrategy(state, action) {
            state.contentStrategies = state.contentStrategies.filter(
                (strategy) => strategy.id !== action.payload
            );
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            strategiesApi.endpoints.listContentStrategies.matchFulfilled,
            (state, action) => {
                if (!state.activeContentStrategy) {
                    state.activeContentStrategy = action.payload.length > 0 ? action.payload[0] : null;
                }

                state.contentStrategies = action.payload;
            }
        ),
            builder.addMatcher(
                strategiesApi.endpoints.createContentStrategy.matchFulfilled,
                (state, action) => {
                    if ("id" in action.payload) {
                        state.activeContentStrategy = action.payload;
                        state.contentStrategies.push(action.payload);
                    }
                }
            );
    },
});

export const { setActiveContentStrategy, removeContentStrategy } = strategySlice.actions;
export default strategySlice.reducer;
