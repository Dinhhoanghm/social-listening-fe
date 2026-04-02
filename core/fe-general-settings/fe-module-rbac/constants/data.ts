import { Rbac } from "./type";

export const UPDATE_DATA = (data: Rbac) => ({
  code: data.code,
  name: data.name,
  description: data.description,
  isActive: data.isActive,
});
