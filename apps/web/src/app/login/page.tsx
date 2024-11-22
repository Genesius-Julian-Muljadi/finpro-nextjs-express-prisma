"use client";

import LoginMenu from "@/components/header/subcomponents/loginmenu";
import { store } from "@/redux/store";
import { useEffect } from "react";
import { Provider } from "react-redux";

export default function LoginPage() {
    useEffect(() => {
        const loginMenu = document.getElementById("loginmenudiv") as HTMLDivElement;
        loginMenu.style.display = "grid";
    }, []);

    return (
        <Provider store={store}>
            <LoginMenu />
        </Provider>
    );
};