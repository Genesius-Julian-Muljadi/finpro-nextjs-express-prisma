import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menuOpen: 0
};

const toggleMenuSlice = createSlice({
    name: "TMSlice",
    initialState,
    reducers: {
        toggleMenu: (state: {menuOpen: number}, input: {payload: string}) => {
            if (input.payload === "login") {
                state.menuOpen = 1;
            } else if (input.payload === "signup") {
                state.menuOpen = 2;
            } else if (input.payload === "reset") {
                state.menuOpen = 0;
            } else {
                console.log("Invalid input: " + input.payload);
            };
        }
    },
});

export const { toggleMenu } = toggleMenuSlice.actions;
export default toggleMenuSlice.reducer;