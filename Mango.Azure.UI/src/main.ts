import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalGuard, MsalRedirectComponent, MsalService, MsalBroadcastService, MsalInterceptor, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { msalConfig, protectedResources } from './app/auth-config';
import { AuthService } from './app/services/auth.service';

async function initializeMsal() {
  const msalInstance = new PublicClientApplication(msalConfig);
  await msalInstance.initialize();
  return msalInstance;
}

initializeMsal().then((msalInstance) => {
  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(HttpClientModule),
      provideRouter(routes),
      { provide: MSAL_INSTANCE, useValue: msalInstance },
      { provide: MSAL_GUARD_CONFIG, useValue: { interactionType: InteractionType.Redirect } },
      { provide: MSAL_INTERCEPTOR_CONFIG, useValue: { interactionType: InteractionType.Redirect, protectedResourceMap: new Map([[protectedResources.api.endpoint, protectedResources.api.scopes]]) } },
      MsalService,
      MsalBroadcastService,
      MsalGuard,
      AuthService,
      { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    ],
  }).catch(err => console.error(err));
});
