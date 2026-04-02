/** Khớp `crawler_config.parameters` (JSON) — ví dụ min_word_count, source, lang */
export interface CrawlerParametersPayload {
  /** Tên nguồn hiển thị (VnExpress, API X…) */
  source?: string;
  /** Ngưỡng tối thiểu cho Topic Modelling */
  min_word_count?: number;
  lang?: string;
  [key: string]: unknown;
}

export interface CrawlerConfigRow {
  id?: number;
  sourceId?: number;
  name?: string;
  crawlerType?: string;
  parseType?: string;
  seedUrls?: string[];
  isActive?: boolean;
  frequencyMinutes?: number;
  maxDepth?: number;
  maxRetry?: number;
  parameters?: unknown;
  createdAt?: string;
  updatedAt?: string;
  lastCrawlAt?: string;
}

export interface CrawlerConfigRequestBody {
  /** FK `crawler_source.id` — tùy chọn */
  sourceId?: number | null;
  name: string;
  crawlerType: string;
  parseType: string;
  seedUrls: string[];
  isActive: boolean;
  frequencyMinutes: number;
  maxDepth: number;
  maxRetry: number;
  parameters?: string;
}

export interface CrawlerSourceRow {
  id?: number;
  name?: string;
  platform?: string;
  baseUrl?: string;
  sourceType?: string;
  metadata?: unknown;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrawlerSourceRequestBody {
  name: string;
  platform?: string;
  baseUrl?: string;
  sourceType?: string;
  metadata?: string;
}

export interface CrawlerFieldRequestBody {
  crawlerStepId: number;
  fieldName: string;
  fieldType: string;
  extractPath?: string;
  attributeName?: string;
  transformRule?: string;
  isRequired?: boolean;
}

export interface CrawlerCustomScriptRow {
  id?: number;
  name?: string;
  language?: string;
  script?: string;
  description?: string;
}

export interface CrawlerFieldRow {
  id?: number;
  crawlerStepId?: number;
  fieldName?: string;
  fieldType?: string;
  extractPath?: string;
  attributeName?: string;
  transformRule?: string;
  isRequired?: boolean;
  createdAt?: string;
}

export interface CrawlerStepModel {
  id?: number;
  crawlerConfigId?: number;
  stepOrder?: number;
  stepName?: string;
  stepType?: string;
  requestMethod?: string;
  locatorType?: string;
  locatorValue?: string;
  outputUrlType?: string;
  delaySeconds?: number;
  customScriptId?: number | null;
  customScript?: CrawlerCustomScriptRow | null;
  extraConfig?: unknown;
  createdAt?: string;
  crawlerFields?: CrawlerFieldRow[];
}

export interface CrawlerConfigDetail extends CrawlerConfigRow {
  crawlerSteps?: CrawlerStepModel[];
}

export interface CrawlerStepRequestBody {
  crawlerConfigId: number;
  stepOrder: number;
  stepName: string;
  stepType: string;
  requestMethod?: string;
  locatorType?: string;
  locatorValue?: string;
  outputUrlType?: string;
  delaySeconds?: number;
  customScriptId?: number | null;
  extraConfig?: string;
}
