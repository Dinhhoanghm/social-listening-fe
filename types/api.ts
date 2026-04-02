export interface DfResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface Page<T> {
  total?: number;
  page?: number;
  items?: T[];
}

export interface Search {
  name: string;
  option: "EQUAL" | "LIKE" | "LIKE_REGEX" | "LIKE_IGNORE_CASE";
}

export interface Filter {
  name: string;
  value: unknown;
  operation?: string;
}

export interface Order {
  property: string;
  direction: "asc" | "desc" | "ASC" | "DESC";
}

export interface SearchRequest {
  page: number;
  pageSize: number;
  keyword?: string;
  sorts?: Order[];
  filters?: Filter[];
  searches?: Search[];
}

export interface MultiDeleteResponse {
  totalRequested: number;
  totalDeleted: number;
  failedIds: number[];
}
