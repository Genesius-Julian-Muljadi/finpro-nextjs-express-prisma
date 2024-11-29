import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menuOpen: false
};

const toggleSStatsSlice = createSlice({
    name: "TSSSlice",
    initialState,
    reducers: {
        toggleSStats: (state: {menuOpen: boolean}, input: {payload: string}) => {
            if (input.payload === "open") {
                state.menuOpen = true;
            } else if (input.payload === "close") {
                state.menuOpen = false;
            } else {
                console.log("Invalid input: " + input.payload);
            };
        }
    },
});

export const { toggleSStats } = toggleSStatsSlice.actions;
export default toggleSStatsSlice.reducer;