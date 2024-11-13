import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menuIsOpen: false
};

const toggleLoginMenuSlice = createSlice({
    name: "TLMSlice",
    initialState,
    reducers: {
        toggleMenu: (state: {menuIsOpen: Boolean | null}, input: {payload: string}) => {
            if (input.payload === "open") {
                state.menuIsOpen = true;
            } else if (input.payload === "close") {
                state.menuIsOpen = false;
            } else if (input.payload === "reset") {
                state.menuIsOpen = null;
            } else {
                console.log("Invalid input: " + input.payload);
            };
        }
    },
});

export const { toggleMenu } = toggleLoginMenuSlice.actions;
export default toggleLoginMenuSlice.reducer;