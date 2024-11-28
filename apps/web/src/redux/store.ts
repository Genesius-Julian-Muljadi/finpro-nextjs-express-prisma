import { configureStore } from "@reduxjs/toolkit";
import TMSlice from "./slices/togglemenu";
import LRSSlice from "./slices/loginroleselect";
import TGSSlice from "./slices/toggleglobalstatistics";

export const store = configureStore({
    reducer: {
        TMSlice,
        LRSSlice,
        TGSSlice,
    },
});