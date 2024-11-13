import { configureStore } from "@reduxjs/toolkit";
import TLMSlice from "./slices/togglemenu";
import LRSSlice from "./slices/loginroleselect";

export const store = configureStore({
    reducer: {
        TLMSlice,
        LRSSlice,
    },
});