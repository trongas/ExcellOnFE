import { Action } from "@ngrx/store";

export enum EClientActions {
  LOGIN = '[USER] Login',
  LOGIN_SUCCESS = '[USER] Login Success',
  LOGIN_FAIL = '[USER] Login Fail',
  REGISTER = '[USER] Register',
  REGISTER_SUCCESS = '[USER] Register Success',
  REGISTER_FAIL = '[USER] Register Fail',
  LOGOUT = '[USER] Logout', 
}

export class Login implements Action {
  public readonly type = EClientActions.LOGIN;
  constructor(public payload: { email: string; password: string }) {}
}

export class LoginSuccess implements Action {
  public readonly type = EClientActions.LOGIN_SUCCESS;
  constructor(public payload: { userName: string, token: string }) {}
}

export class LoginFail implements Action {
  public readonly type = EClientActions.LOGIN_FAIL;
  constructor() {}
}


export class Register implements Action {
  readonly type = EClientActions.REGISTER;
  constructor(public payload: { firstName: string, lastName: string,phone:string, dob:string, email: string, password: string }) {}
}

export class RegisterSuccess implements Action {
  readonly type = EClientActions.REGISTER_SUCCESS;
  constructor(public payload: { token: string }) {}
}

export class RegisterFail implements Action {
  readonly type = EClientActions.REGISTER_FAIL;
}

export class Logout implements Action {
  readonly type = EClientActions.LOGOUT;
}

export type ClientActions = Login | LoginSuccess | LoginFail | Register | RegisterSuccess | RegisterFail | Logout;
