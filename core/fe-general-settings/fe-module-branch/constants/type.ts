export interface Branch {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  numOfEmployees: number;
  parentId: number | null;
  children?: {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
    numOfEmployees: number;
  }[];
}

export interface CreateBranch {
  code: string;
  name: string;
  parentId: string | null;
}

export interface EditBranch {
  code: string;
  name: string;
  parentId: string;
  isActive: boolean;
}
