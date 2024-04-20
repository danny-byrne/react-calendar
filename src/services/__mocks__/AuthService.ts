import { IAuthService } from "../AuthService";
import { msalConfig } from "@src/app/Constants";
import { PublicClientApplication } from "@azure/msal-browser";

export const AuthService: IAuthService = {
  getMsalInstance: () => {
    return new PublicClientApplication(msalConfig);
  },
  loginRedirect: (redirectRoute: string) => {},
  loginRedirectWithCustomState: (redirectRoute: string, state: string) => {},
  logout: () => {},
  getUserName: () => {
    const accounts = [{ name: "Test User" }];
    return accounts[0].name;
  },
  getIsAuthenticated: () => {
    return true;
  },
  getAccount: () => TestAccount,
  getUserId: () => "userId",
  getAccessToken: async () => "mockToken",
  requestGraphConsent: () => Promise.resolve(),
  setActiveAccount: () => {},
};

const TestAccount = {
  homeAccountId: "homeAccountId",
  environment: "environment",
  tenantId: "tenantId",
  username: "username",
  localAccountId: "localAccountId",
};
