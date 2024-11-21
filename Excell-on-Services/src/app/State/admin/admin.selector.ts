import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IAdminLoginState, IAdminState } from './admin.states';

const getAdminState = createFeatureSelector<IAdminState>('admin');

export const getAdminLoginState = createSelector(
  getAdminState,
  (state: IAdminState) => state.loginAdmin
);

export const getAdminLoadingLogin = createSelector(
  getAdminLoginState,
  (loginState: IAdminLoginState) => loginState.loading
);

export const getAdminSuccessLogin = createSelector(
  getAdminLoginState,
  (loginState: IAdminLoginState) => loginState.success
);

export const getAdminFailLogin = createSelector(
  getAdminLoginState,
  (loginState: IAdminLoginState) => loginState.fail
);

export const getAdminToken = createSelector(
  getAdminLoginState,
  (loginState: IAdminLoginState) => loginState.tokenAdmin
);

export const getAdminEmail = createSelector(
  getAdminLoginState,
  (loginState: IAdminLoginState) => loginState.userName
);

export const getAdminIsLoggedOut = createSelector(
  getAdminLoginState,
  (loginState: IAdminLoginState) => !loginState.loading && !loginState.success
);
