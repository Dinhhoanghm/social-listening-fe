export interface CreateUser {
  username: string;
  code: string;
  fullName: string;
  password: string;
  isActive: boolean;
  email: string;
  phoneNumber: string;
  positionId: number;
  branchId: number;
  roleId: number;
}

export interface UpdateUser {
  fullName: string;
  isActive: boolean;
  email: string;
  phoneNumber: string;
  positionId: number;
  branchId: number;
  roleId: number;
}

export interface User {
  id: number;
  username: string;
  code: string;
  fullName: string;
  password: string;
  email: string;
  phoneNumber: string;
  position: Position;
  branch: Branch;
  role: Role;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  creator: Creator;
  updater: Updater;
}

interface Creator {
  username: string;
}

interface Updater {
  username: string;
}

interface Position {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}
