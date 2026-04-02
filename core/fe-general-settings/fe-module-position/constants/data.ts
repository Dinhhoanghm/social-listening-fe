import { Position } from "./type";

export const CREATE_DATA = { code: "", name: "" };

export const UPDATE_DATA = (data: Position) => ({
  code: data.code,
  name: data.name,
  isActive: data.isActive,
});
