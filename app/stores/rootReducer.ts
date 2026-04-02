import { combineReducers } from "redux";
import { baseApi } from "@/lib/store/apis/baseApi";
import { appReducer, tabReducer } from "@/fe-cores/reducers";

const appRootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  app: appReducer,
  tab: tabReducer,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reducer = (state: any, action: any) =>
  appRootReducer(state, action);
