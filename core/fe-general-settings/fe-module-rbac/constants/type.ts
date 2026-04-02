export interface Rbac {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: number;
  creator: User;
  updater: User;
  updatedAt: number;
}

export interface User {
  username: string;
}

export interface SubmitRbac {
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  menus: MenuItem[];
}

interface MenuItem {
  id: number;
  permissionAccessId: number;
  permissionIds: number[];
  children?: MenuItem[];
}
