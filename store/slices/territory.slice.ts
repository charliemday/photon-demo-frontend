import { createSlice } from '@reduxjs/toolkit'
import { authApi, userApi } from 'api';
import { Territory } from 'types';

export interface TerritoryState {
    activeTerritory: Territory | null;
}

const initialState: TerritoryState = {
    activeTerritory: null,
};

export const territorySlice = createSlice({
    name: 'team',
    initialState,
    reducers: {
        setActiveTerritory(state, action) {
            state.activeTerritory = action.payload;
        }
    },
    extraReducers: (builder) => {
    },
})

// Action creators are generated for each case reducer function
// export const { } = territorySlice.actions

export const { setActiveTerritory } = territorySlice.actions;
export default territorySlice.reducer;