export interface IClientRegistrationState {
  loading: boolean;
  success: boolean;
  fail: boolean;
  userName: string;
}

export interface IClientLoginState {
  loading: boolean;
  success: boolean;
  fail: boolean;
  userName: string;
  token: string | null;
}

export interface IClientState {
  login: IClientLoginState;
  registration: IClientRegistrationState; 
}