# AuthService

## Service Description

This acts as the primary service for interacting with authentication.

## Service Methods

getMsalInstance: Returns the PublicClientApplication instance. Needed for wrapping `<App />` component in MsalProvider in toplevel index.tsx.
loginRedirect: Sends user to login flow using a redirect to https://login.microsoftonline.com/common. Once complete, user is redirected to LoginLoadingPAge.
logout: Sends user to a logout flow using redirect to https://login.microsoftonline.com/common. Once complete, user is redirected to LandingPage.
getUserName: Returns the name of the currently signed in user.
getIsAuthenticated: Returns whether or not a user is currently signed in.
getAccount: Returns the account info of the currently signed in user.
getUserId: Returns the unique ID of the currently signed in user. Used for linking user identity with Windcrest Database.
logAccessToken: Debug method used to expose user's authentication token in the console.
setActiveAccount: Used to set the currently signed in user as 'active'. Necessary for acquiring tokens.

## Documentation References

AccountInfo object: https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_common.html#accountinfo

Account object in MSAL library: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md

Microsoft ID Tokens: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens

## TODO

Error handling.
