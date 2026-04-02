import type { CrawlerParametersPayload } from "@/types/crawler";

export function parseParametersJson(
  raw: unknown
): CrawlerParametersPayload | undefined {
  if (raw == null) return undefined;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as CrawlerParametersPayload;
    } catch {
      return undefined;
    }
  }
  if (typeof raw === "object") {
    return raw as CrawlerParametersPayload;
  }
  return undefined;
}

/** `parameters.source` — tên hiển thị nguồn (Topic Modelling / metadata). */
export function getSourceLabelFromParameters(raw: unknown): string | undefined {
  const src = parseParametersJson(raw)?.source;
  if (typeof src === "string" && src.trim()) return src.trim();
  return undefined;
}

export function mergeParametersJson(
  existing: unknown,
  payload: CrawlerParametersPayload
): string {
  const base = parseParametersJson(existing) ?? {};
  return JSON.stringify({ ...base, ...payload });
}
