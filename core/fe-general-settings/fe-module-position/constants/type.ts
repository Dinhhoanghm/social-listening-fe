export interface Position {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: number;
  creator: string;
  updater: string;
  updatedAt: number;
}

export interface CreatePosition {
  code: string;
  name: string;
}

export interface UpdatedPosition {
  code: string;
  name: string;
  isActive: boolean;
}
