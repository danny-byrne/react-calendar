import {
  msalConfig,
  loginRequest,
  graphRequest,
  useFirstPartyAuth,
} from "src/app/Constants";
// import {
//     InteractionRequiredAuthError,
//     IPublicClientApplication,
//     PublicClientApplication,
//     AccountInfo,
// } from '@azure/msal-browser';
import { BASE_REDIRECT_URI } from "src/app/Constants";
import { LOCAL_STORAGE_KEYS } from "src/app/Strings";

const msalInstance = new PublicClientApplication(msalConfig);

export interface IAuthService {
  getMsalInstance: () => IPublicClientApplication;
  loginRedirect: (redirectRoute: string) => void;
  loginRedirectWithCustomState: (redirectRoute: string, state: string) => void;
  logout: () => void;
  getUserName: () => string;
  getIsAuthenticated: () => boolean;
  getAccount: () => AccountInfo;
  getUserId: () => string;
  getAccessToken: () => Promise<string>;
  requestGraphConsent: () => Promise<void>;
  setActiveAccount: () => void;
}

type IdTokenClaims = {
  oid: string;
};

export const AuthService: IAuthService = {
  getMsalInstance: () => msalInstance,
  loginRedirect: (redirectRoute: string) => {
    msalInstance.loginRedirect({
      ...loginRequest,
      redirectUri: `${BASE_REDIRECT_URI}${redirectRoute}`,
      prompt: "select_account",
    });
  },
  loginRedirectWithCustomState: (redirectRoute: string, state: string) => {
    msalInstance.loginRedirect({
      ...loginRequest,
      redirectUri: `${BASE_REDIRECT_URI}${redirectRoute}`,
      state: state,
      prompt: "select_account",
    });
  },
  logout: () => {
    // Clearing localStorage when the user logs out.
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CARE_CIRCLE_ID);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_ERROR);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.HAS_REQUESTED_MS_GRAPH_CONSENT);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.INVITE_CODE);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ROLE);

    msalInstance.logoutRedirect();
  },
  getUserName: () => {
    const account = AuthService.getAccount();
    return account.name;
  },
  getIsAuthenticated: () => {
    const activeAccount = msalInstance.getAllAccounts();
    return activeAccount.length > 0 ? true : false;
  },
  getAccount: () => {
    const accounts = msalInstance.getAllAccounts();
    return accounts[0];
  },
  getUserId: () => {
    try {
      const { idTokenClaims } = AuthService.getAccount();
      const { oid } = idTokenClaims as IdTokenClaims;
      return oid;
    } catch {
      return "Not Signed In";
    }
  },
  getAccessToken: async () => {
    // See:
    // - https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-net-acquire-token-silently
    // - https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-error-handling-js
    try {
      const tokenResponse = await msalInstance.acquireTokenSilent(loginRequest);
      const { accessToken } = tokenResponse;
      return accessToken;
    } catch (error) {
      // error.errorCode === "consent_required"
      // error.errorCode === "interaction_required"
      // error.errorCode === "login_required"

      // If the error message includes additional claims that need to be in the authorization
      // token, add them to the request.
      if (error.errorMessage.claims) {
        loginRequest.claimsRequest = JSON.stringify(error.ErrorMessage.claims);
      }

      // Since the silent acquisition failed, do a full (user-facing) request.
      if (error instanceof InteractionRequiredAuthError) {
        try {
          await msalInstance.acquireTokenRedirect(loginRequest);
          // I don't think we need to handle the response here as the redirect will do
          // a flow that ends with another page, triggering another getAccessToken request.
        } catch (error) {
          // TODO: Should we throw this?
          // eslint-disable-next-line no-console
          console.log(error);
        }
      }
    }
  },
  requestGraphConsent: async () => {
    if (!useFirstPartyAuth) {
      await msalInstance.acquireTokenRedirect(graphRequest);
    }
  },
  setActiveAccount: () => {
    const activeAccount = AuthService.getAccount();
    msalInstance.setActiveAccount(activeAccount);
  },
};
