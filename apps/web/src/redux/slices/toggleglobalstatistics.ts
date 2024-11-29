import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menuOpen: false
};

const toggleGStatsSlice = createSlice({
    name: "TGSSlice",
    initialState,
    reducers: {
        toggleGStats: (state: {menuOpen: boolean}, input: {payload: string}) => {
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

export const { toggleGStats } = toggleGStatsSlice.actions;
export default toggleGStatsSlice.reducer;