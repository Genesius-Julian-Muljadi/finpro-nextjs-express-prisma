"use client";

// import LoginMenu from "@/components/header/subcomponents/loginmenu";
import { store } from "@/redux/store";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Provider } from "react-redux";

export default function LoginPage() {
    useEffect(() => {
        const loginMenu = document.getElementById("loginmenudiv") as HTMLDivElement;
        loginMenu.style.display = "grid";
    }, []);

    const DynamicLoginMenu = dynamic(
        () => import('@/components/header/subcomponents/loginmenu/index'),
        { ssr: false }
      );

    return (
        <Provider store={store}>
            <DynamicLoginMenu />
        </Provider>
    );
};