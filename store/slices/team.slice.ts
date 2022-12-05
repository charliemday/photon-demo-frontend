import { createSlice } from '@reduxjs/toolkit'
import { authApi, userApi } from 'api';
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
    },
})

// Action creators are generated for each case reducer function
// export const { } = teamSlice.actions

export const { setActiveTeam } = teamSlice.actions;
export default teamSlice.reducer;