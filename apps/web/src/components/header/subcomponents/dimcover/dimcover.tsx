"use client";

import { toggleMenu } from "@/redux/slices/togglemenu";
import { useDispatch, useSelector } from "react-redux";

export default function DimCover() {
    let b = useSelector((state: {TMSlice: {menuIsOpen: Boolean | null}}) => state.TMSlice.menuIsOpen);
    const dispatch = useDispatch();

    return (
        <div>
            <div className="fixed bg-slate-600 h-screen w-screen z-40 opacity-25" id="dimcover" 
            onClick={() => {(b) ? dispatch(toggleMenu('close')) : dispatch(toggleMenu('open'))}} />
        </div>
    );
};