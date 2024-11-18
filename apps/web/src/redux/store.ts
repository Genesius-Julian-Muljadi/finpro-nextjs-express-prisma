import { configureStore } from "@reduxjs/toolkit";
import TMSlice from "./slices/togglemenu";
import LRSSlice from "./slices/loginroleselect";

export const store = configureStore({
    reducer: {
        TMSlice,
        LRSSlice,
    },
});