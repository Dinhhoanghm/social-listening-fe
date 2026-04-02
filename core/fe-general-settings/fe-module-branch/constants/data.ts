import { Branch } from "./type";

export const CREATE_DATA = { code: "", name: "", parentId: null };

export const UPDATE_DATA = (data: Branch) => ({
  code: data.code,
  name: data.name,
  isActive: data.isActive,
  parentId: data.parentId,
});
