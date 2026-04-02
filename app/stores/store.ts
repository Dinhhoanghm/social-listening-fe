import { store } from "@/fe-base/reducers";
import { reducer } from "./rootReducer";
import { _middleware } from "./middleware";

const reduxStore = store(reducer, _middleware);

export { reduxStore };
