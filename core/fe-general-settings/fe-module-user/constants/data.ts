import { User } from "./type";

const CREATE_DATA = {
  username: "",
  code: "",
  fullName: "",
  password: "",
  isActive: true,
  email: "",
  phoneNumber: null,
  positionId: null,
  branchId: null,
  roleId: null,
};

const UPDATE_DATA = (data: User) => ({
  username: data?.username,
  code: data?.code,
  fullName: data?.fullName,
  isActive: data?.isActive,
  email: data?.email,
  phoneNumber: data?.phoneNumber,
  positionId: data?.position?.id,
  branchId: data?.branch?.id,
  roleId: data?.roleId,
});

export { CREATE_DATA, UPDATE_DATA };
