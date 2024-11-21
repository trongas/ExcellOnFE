export interface IAdminLoginState {
  loading: boolean;
  success: boolean;
  fail: boolean;
  userName: string;
  tokenAdmin: string | null;
}

export interface IAdminState {
  loginAdmin: IAdminLoginState;
}
