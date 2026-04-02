/**
 * Aligns with crawler core pipeline (CrawlerType / StepType).
 * Backend may expect lowercase `crawler_type` values — adjust if your API differs.
 */
export const CRAWLER_TYPE_OPTIONS = [
  {
    value: "http",
    label: "HTTP / Web",
    hint: "Tin, forum, trang tĩnh hoặc động",
  },
  { value: "api", label: "API", hint: "REST, JSON có cấu trúc" },
  { value: "android", label: "Android", hint: "App mạng xã hội (Android)" },
  { value: "ios", label: "iOS", hint: "App mạng xã hội (iOS)" },
  {
    value: "document",
    label: "Document",
    hint: "PDF, DOCX — Apache Tika",
  },
] as const;

export const PARSE_TYPES = ["HTML", "JSON", "XML", "RSS"] as const;

export const REQUEST_METHODS = ["GET", "POST"] as const;

export const LOCATOR_TYPES = [
  "css",
  "xpath",
  "regex",
  "id",
  "name",
  "json_path",
] as const;

/** Khớp `FieldType` backend (giá trị chữ thường). */
export const FIELD_TYPE_OPTIONS = [
  { value: "text", label: "text" },
  { value: "number", label: "number" },
  { value: "datetime", label: "datetime" },
  { value: "url", label: "url" },
  { value: "list", label: "list" },
  { value: "json", label: "json" },
] as const;

/** Khớp `TransformRule` backend — chuỗi có thể nối bằng dấu phẩy trong một field. */
export const TRANSFORM_RULE_OPTIONS = [
  { value: "strip", label: "strip" },
  { value: "normalize", label: "normalize" },
  { value: "to_number", label: "to_number" },
  { value: "to_datetime", label: "to_datetime" },
  { value: "to_url", label: "to_url" },
  { value: "from_url", label: "from_url" },
  { value: "to_list", label: "to_list" },
  { value: "to_json", label: "to_json" },
  { value: "join", label: "join" },
  { value: "clean_html", label: "clean_html" },
  { value: "extract_pattern", label: "extract_pattern" },
  { value: "first", label: "first" },
] as const;

/** Khớp `StepType` backend — giá trị API là chữ thường. */
export const STEP_TYPE_OPTIONS = [
  { value: "fetch", label: "fetch" },
  { value: "navigate", label: "navigate" },
  { value: "interact", label: "interact" },
  { value: "extract", label: "extract" },
  { value: "filter", label: "filter" },
  { value: "transform", label: "transform" },
  { value: "script", label: "script" },
] as const;
