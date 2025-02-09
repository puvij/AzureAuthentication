import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: 'c2a048e7-1963-4956-9267-7355cea7bfde', // Replace with your Azure AD App Registration ID
    authority: 'https://login.microsoftonline.com/79088e28-9c8b-4dad-83ff-1b5df1955e9f', // Replace with your Tenant ID
    redirectUri: '/',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: true,
  }, 
  system: {
    loggerOptions: {
      loggerCallback: (logLevel, message, containsPii) => { },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    }
  }
};

export const protectedResources = {
  api: {
    endpoint: 'https://localhost:7001', // Ensure this points to your microservice
    scopes: ['api://mango.microservices/ApplicationID']
  }
};

export const LogoutProperties = {
  Url: 'https://localhost:7000'
};

