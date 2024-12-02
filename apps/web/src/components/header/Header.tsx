"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import dynamic from "next/dynamic";

export function Header() {
  const DynamicHeader = dynamic(
      () => import('./dynamicheader'),
      { ssr: false }
    );

  try {
    return (
      <Provider store={store}>
        <DynamicHeader />
      </Provider>
    );
  } catch (err) {
    console.log(err);
    return null;
  };
};
