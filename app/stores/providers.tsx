"use client";

import { Provider } from "react-redux";
import { reduxStore } from "./store";

export const ProviderRedux = (props: React.PropsWithChildren) => {
  return <Provider store={reduxStore}>{props.children}</Provider>;
};
