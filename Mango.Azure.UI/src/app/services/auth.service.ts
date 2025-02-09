import { Injectable } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { RedirectRequest, InteractionStatus, AuthenticationResult } from '@azure/msal-browser';
import { protectedResources, LogoutProperties } from '../auth-config';
import { filter } from 'rxjs/operators';
import { ResponseDto, User } from '../models/response.model';
import { Observable, catchError, map, throwError } from 'rxjs'; // ✅ Import RxJS utilities
import { ApiService } from './api.service'; // ✅ Use centralized API service

@Injectable({ providedIn: 'root' })
export class AuthService {
  private interactionInProgress = false;

  constructor(
    private authService: MsalService,
    private broadcastService: MsalBroadcastService,
    private apiService: ApiService // ✅ Use ApiService instead of direct HttpClient
  ) {
    // ✅ Track authentication state changes
    this.broadcastService.inProgress$
      .pipe(filter(status => status !== InteractionStatus.None))
      .subscribe(() => this.setInteractionInProgress(true));

    this.broadcastService.inProgress$
      .pipe(filter(status => status === InteractionStatus.None))
      .subscribe(() => {
        this.setInteractionInProgress(false);
        this.handlePostLogin(); // ✅ Automatically trigger user validation
      });
  }

  get instance() {
    return this.authService.instance;
  }

  setInteractionInProgress(value: boolean): void {
    console.log(`🔄 Setting interactionInProgress: ${value}`);
    this.interactionInProgress = value;
  }

  login(): void {
    if (this.authService.instance.getActiveAccount()) {
      console.log("✅ User already logged in, skipping login.");
      this.handlePostLogin(); // ✅ Validate user if already logged in
      return;
    }

    if (this.interactionInProgress) {
      console.warn("⚠️ Authentication already in progress. Skipping duplicate login.");
      return;
    }

    console.log("🔵 Triggering loginRedirect...");
    this.setInteractionInProgress(true);
    this.authService.loginRedirect({ scopes: protectedResources.api.scopes } as RedirectRequest);
  }

  logout(): void {
    console.log("🔴 Logging out...");
    localStorage.clear();
    sessionStorage.clear();
    this.authService.instance.setActiveAccount(null);
    this.authService.logoutRedirect({ postLogoutRedirectUri: LogoutProperties.Url });
  }

  isLoggedIn(): boolean {
    return this.authService.instance.getAllAccounts().length > 0;
  }

  async validateUser(): Promise<void> {
    console.log('🔍 Validating user with ASP.NET Identity...');
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount) {
      const accounts = this.authService.instance.getAllAccounts();

      if (accounts.length === 0) {
        console.warn("⚠️ No accounts found. Prompting user to log in...");
        await this.authService.loginPopup({ scopes: protectedResources.api.scopes });
        activeAccount = this.authService.instance.getActiveAccount();
      } else if (accounts.length === 1) {
        console.log("✅ Only one account found, setting it as active.");
        activeAccount = accounts[0];
        this.authService.instance.setActiveAccount(activeAccount);
      } else {
        console.log("🔹 Multiple accounts found. Prompting user to select an account.");
        await this.authService.loginPopup({ scopes: protectedResources.api.scopes, prompt: "select_account" });
        activeAccount = this.authService.instance.getActiveAccount();
      }
    }

    if (!activeAccount) {
      console.error("❌ No account selected, aborting token request.");
      return;
    }

    try {
      console.log("🔄 Fetching validation token...");
      const tokenResponse = await this.authService.instance.acquireTokenSilent({
        account: activeAccount, // ✅ Explicitly use selected account
        scopes: protectedResources.api.scopes
      });

      if (!tokenResponse || !tokenResponse.accessToken) {
        throw new Error("❌ Failed to acquire access token.");
      }

      // ✅ Use ApiService instead of HttpClient
      this.apiService.get<User>(`${protectedResources.api.endpoint}/api/auth/validate`).pipe(
        map(response => {
          console.log('✅ API Response:', response);

          if (response) {
            this.storeUserData(response, 4 * 60 * 60 * 1000); // Store user data
          } else {
            console.warn("⚠️ API returned failure.");
          }
        }),
        catchError(error => {
          console.error('❌ User validation failed:', error);
          return throwError(() => error); // ✅ Updated error handling
        })
      ).subscribe(); // Subscribe to trigger the request
    } catch (error) {
      console.error('❌ Error acquiring token:', error);
    }
  }

  private async handlePostLogin(): Promise<void> {
    console.log("🔵 Handling post-login operations...");
    if (this.isLoggedIn()) {
      await this.validateUser();
    }
  }

  private storeUserData(userData: User, expirationMs: number): void {
    const expirationTime = Date.now() + expirationMs;
    const dataToStore = {
      userData,
      expiration: expirationTime
    };

    localStorage.setItem('userSession', JSON.stringify(dataToStore));
    console.log("💾 User session stored with expiration at:", new Date(expirationTime));
  }

  getUserData(): User | null {
    const storedData = localStorage.getItem('userSession');

    if (!storedData) {
      console.warn("⚠️ No stored user session found. Redirecting to login...");
      this.redirectToLogin();
      return null;
    }

    const parsedData = JSON.parse(storedData);
    if (Date.now() > parsedData.expiration) {
      console.warn("⏳ User session expired, clearing data and redirecting to login...");
      localStorage.removeItem('userSession');
      this.redirectToLogin();
      return null;
    }

    return parsedData.userData;
  }

  private redirectToLogin(): void {
    console.log("🔄 Redirecting user to login...");
    this.login(); // Calls MSAL login
  }
}
