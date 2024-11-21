import { IAdminLoginState, IAdminState } from './admin.states';
import { AdminActions, EAdminActions } from './admin.actions';

const initialLoginState: IAdminLoginState = {
  loading: false,
  success: false,
  fail: false,
  userName: '',
  tokenAdmin: null,
};

const initialState: IAdminState = {
  loginAdmin: initialLoginState,
};

export function adminReducer(
  state = initialState,
  action: AdminActions
): IAdminState {
  switch (action.type) {
    case EAdminActions.LOGIN_ADMIN:
      return {
        ...state,
        loginAdmin: { ...initialLoginState, loading: true },
      };
    case EAdminActions.LOGIN_SUCCESS_ADMIN:
      return {
        ...state,
        loginAdmin: {
          ...state.loginAdmin,
          loading: false,
          success: true,
          userName: action.payload.userName,
          tokenAdmin: action.payload.tokenAdmin,
        },
      };
    case EAdminActions.LOGIN_FAIL_ADMIN:
      return {
        ...state,
        loginAdmin: { ...state.loginAdmin, loading: false, fail: true },
      };

    case EAdminActions.LOGOUT_ADMIN:
      return {
        ...state,
        loginAdmin: initialLoginState,
      };

    default:
      return state;
  }
}
