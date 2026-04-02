import type { DfResponse } from "@/types/api";

/**
 * Unwraps Spring `DfResponse<T>` (success code `200`) after RTK Query fetch.
 */
export function transformDfResponse<T>(response: unknown): T {
  const r = response as DfResponse<T>;
  if (!r || typeof r !== "object" || !("data" in r)) {
    throw new Error("Phản hồi không hợp lệ");
  }
  if (r.code !== "200") {
    throw new Error(r.message || "Yêu cầu thất bại");
  }
  return r.data as T;
}
