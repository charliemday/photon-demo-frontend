import { createSlice } from '@reduxjs/toolkit'
import { teamApi } from 'api';
import { Team } from 'types';

export interface TeamState {
    activeTeam: Team | null;
}

const initialState: TeamState = {
    activeTeam: null,
};

export const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {
        setActiveTeam(state, action) {
            state.activeTeam = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(teamApi.endpoints.listTeams.matchFulfilled, (state, action) => {
            if (!state.activeTeam) {
                state.activeTeam = action.payload[0];
            }
        })
    },
})

// Action creators are generated for each case reducer function
// export const { } = teamSlice.actions

export const { setActiveTeam } = teamSlice.actions;
export default teamSlice.reducer;