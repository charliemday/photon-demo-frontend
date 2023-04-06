import { createSlice } from "@reduxjs/toolkit";
import { teamApi } from "api";
import { Team } from "types";

export interface TeamState {
    activeTeam: Team | null;
}

const initialState: TeamState = {
    activeTeam: null,
};

export const teamSlice = createSlice({
    name: "team",
    initialState,
    reducers: {
        setActiveTeam(state, action) {
            state.activeTeam = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            teamApi.endpoints.listTeams.matchFulfilled,
            (state, action) => {
                if (!state.activeTeam) {
                    state.activeTeam = action.payload[0];
                }
            }
        ),
            builder.addMatcher(
                teamApi.endpoints.createTeam.matchFulfilled,
                (state, action) => {
                    if ("id" in action.payload) {
                        state.activeTeam = action.payload;
                    }
                }
            );
    },
});

export const { setActiveTeam } = teamSlice.actions;
export default teamSlice.reducer;
