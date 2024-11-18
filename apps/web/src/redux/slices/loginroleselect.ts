import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    actionSelected: 0
};

const loginRoleSelectSlice = createSlice({
    name: "LRSSlice",
    initialState,
    reducers: {
        selectLoginRole: (state: {actionSelected: number}, input: {payload: string}) => {
            if (input.payload === "user") {
                state.actionSelected = 1;
            } else if (input.payload === "organizer") {
                state.actionSelected = 2;
            } else if (input.payload === "reset") {
                state.actionSelected = 0;
            } else {
                console.log("Invalid input: " + input.payload);
            };
        }
    },
});

export const { selectLoginRole } = loginRoleSelectSlice.actions;
export default loginRoleSelectSlice.reducer;