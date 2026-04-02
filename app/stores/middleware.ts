import { middleware } from "@/fe-base/reducers";
import { baseApi } from "@/lib/store/apis/baseApi";

const _middleware = middleware([baseApi.middleware]);

export { _middleware };
