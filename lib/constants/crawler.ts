// ─── CrawlTypeEnum ───────────────────────────────────────────────────────────
export const CRAWLER_TYPE_OPTIONS = [
  {
    value: "http",
    label: "HTTP / Web",
    hint: "Trang tĩnh, SPA, RSS, forum — phân biệt static/dynamic qua loại bước",
  },
  {
    value: "api",
    label: "API",
    hint: "REST hoặc GraphQL, response JSON/XML có cấu trúc",
  },
  {
    value: "android",
    label: "Android",
    hint: "Tự động hóa app Android qua UIAutomator2 hoặc mitmproxy",
  },
  {
    value: "ios",
    label: "iOS",
    hint: "Tự động hóa app iOS qua XCUITest",
  },
  {
    value: "document",
    label: "Document",
    hint: "File nhị phân cần parse: PDF, DOCX, XLSX — Apache Tika",
  },
] as const;

// ─── CrawlStepEnum ───────────────────────────────────────────────────────────
export const STEP_TYPE_OPTIONS = [
  {
    value: "fetch",
    label: "Fetch",
    hint: "HTTP GET/POST — web tĩnh, RSS, API không cần JS",
  },
  {
    value: "navigate",
    label: "Navigate",
    hint: "Mở browser có JS (Playwright) — SPA, trang cần render trước khi đọc DOM",
  },
  {
    value: "interact",
    label: "Interact",
    hint: "Thao tác browser/app: scroll, click, input, wait",
  },
  {
    value: "extract",
    label: "Extract",
    hint: "Đọc DOM/XML/JSON → lấy data theo crawler_field",
  },
  {
    value: "discover",
    label: "Discover",
    hint: "Đọc DOM/XML/JSON → sinh URL mới đưa vào task queue",
  },
  {
    value: "filter",
    label: "Filter",
    hint: "Lọc và dedup URL trước khi enqueue — kiểm tra url_hash, pattern",
  },
  {
    value: "transform",
    label: "Transform",
    hint: "Clean/normalize data đã có, không thực hiện thêm request",
  },
  {
    value: "download",
    label: "Download",
    hint: "Tải file nhị phân về disk: ảnh, video, PDF, DOCX",
  },
  {
    value: "script",
    label: "Script",
    hint: "Chạy Python/JS script tùy biến từ crawler_custom_script",
  },
  {
    value: "python_crawl",
    label: "Python Crawl",
    hint: "SeleniumBase UC mode — vượt bot-detection (DataDome, Cloudflare, NYT). Hỗ trợ login flow + scroll qua extra_config",
  },
] as const;

// ─── LocatorType ──────────────────────────────────────────────────────────────
export const LOCATOR_TYPE_OPTIONS = [
  {
    value: "css",
    label: "CSS",
    hint: "CSS selector — HTML DOM. Ví dụ: .product-name, meta[property='og:image']",
  },
  {
    value: "xpath",
    label: "XPath",
    hint: "XPath expression — XML hoặc Android UI hierarchy. Ví dụ: //item/link",
  },
  {
    value: "json_path",
    label: "JSONPath",
    hint: "JSONPath expression — API response hoặc XHR intercept. Ví dụ: $.list[*].title",
  },
  {
    value: "regex",
    label: "Regex",
    hint: "Regular expression — validate hoặc filter URL trong bước FILTER",
  },
  {
    value: "js_eval",
    label: "JS Eval",
    hint: "JavaScript expression chạy trong browser context (Playwright evaluate)",
  },
  {
    value: "package",
    label: "Package",
    hint: "Android app package name để launch qua ADB. Ví dụ: com.zhiliaoapp.musically",
  },
] as const;

// ─── OutputUrlEnum ────────────────────────────────────────────────────────────
export const OUTPUT_URL_TYPE_OPTIONS = [
  {
    value: "none",
    label: "None",
    hint: "Không sinh URL mới — dùng cho EXTRACT, TRANSFORM",
  },
  {
    value: "page",
    label: "Page",
    hint: "URL trang/endpoint cần fetch tiếp trong pipeline",
  },
  {
    value: "media",
    label: "Media",
    hint: "URL file nhị phân cần download: ảnh, video, PDF, DOCX",
  },
  {
    value: "feed",
    label: "Feed",
    hint: "URL trả về danh sách URL khác: RSS, sitemap, API list endpoint",
  },
] as const;

// ─── FieldType ────────────────────────────────────────────────────────────────
export const FIELD_TYPE_OPTIONS = [
  { value: "text", label: "Text", hint: "Chuỗi văn bản thuần — tiêu đề, tên tác giả" },
  { value: "number", label: "Number", hint: "Số nguyên hoặc số thực" },
  { value: "datetime", label: "DateTime", hint: "Ngày giờ ISO 8601 — kết hợp to_datetime" },
  { value: "url", label: "URL", hint: "Địa chỉ URL đã normalize — kết hợp to_url" },
  { value: "list", label: "List", hint: "Mảng nhiều giá trị cùng loại — tag, ảnh, hashtag" },
  { value: "json", label: "JSON", hint: "Object phức tạp lưu dạng JSON — bảng thông số" },
] as const;

// ─── TransformRule (không có enum riêng, dựa theo tài liệu backend) ───────────
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

export const PARSE_TYPES = ["HTML", "JSON", "XML", "RSS"] as const;

export const REQUEST_METHODS = ["GET", "POST"] as const;
