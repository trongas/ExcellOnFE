import { Action } from "@ngrx/store";

export enum EAdminActions {
    LOGIN_ADMIN = '[ADMIN] Login',
    LOGIN_SUCCESS_ADMIN = '[ADMIN] Login Success',
    LOGIN_FAIL_ADMIN = '[ADMIN] Login Fail',
    LOGOUT_ADMIN = '[ADMIN] Logout', 
  }
  
  export class LoginAdmin implements Action {
    public readonly type = EAdminActions.LOGIN_ADMIN;
    constructor(public payload: { email: string; password: string }) {}
  }
  
  export class LoginSuccessAdmin implements Action {
    public readonly type = EAdminActions.LOGIN_SUCCESS_ADMIN;
    constructor(public payload: { userName: string, tokenAdmin: string }) {}
  }
  
  export class LoginFailAdmin implements Action {
    public readonly type = EAdminActions.LOGIN_FAIL_ADMIN;
    constructor() {}
  }
  export class LogoutAdmin implements Action {
    readonly type = EAdminActions.LOGOUT_ADMIN;
  }
  
  export type AdminActions = LoginAdmin | LoginSuccessAdmin | LoginFailAdmin | LogoutAdmin;
  