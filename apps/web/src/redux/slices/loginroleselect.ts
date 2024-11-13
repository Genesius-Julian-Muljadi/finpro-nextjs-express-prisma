import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    roleSelected: 0
};

const loginRoleSelectSlice = createSlice({
    name: "LRSSlice",
    initialState,
    reducers: {
        selectLoginRole: (state: {roleSelected: number}, input: {payload: string}) => {
            if (input.payload === "participant") {
                state.roleSelected = 1;
            } else if (input.payload === "organizer") {
                state.roleSelected = 2;
            } else if (input.payload === "reset") {
                state.roleSelected = 0;
            } else {
                console.log("Invalid input: " + input.payload);
            };
        }
    },
});

export const { selectLoginRole } = loginRoleSelectSlice.actions;
export default loginRoleSelectSlice.reducer;