"use client";

import { store } from "@/redux/store";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";

export default function LoginPage() {
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