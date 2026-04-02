export const getToken = (state: any) => state.auth?.token;

export const getSpaceIdSelected = (state: any) => state.ui?.spaceSelected;

export const getRefreshToken = (state: any) => state.auth?.refreshToken;

export const getOrganizationCode = (state: any) => state.auth?.organizationCode;
