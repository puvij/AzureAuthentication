import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
//import { AppRoutingModule } from './1app-routing.module';

// MSAL Modules
import { MsalGuard, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { msalConfig, protectedResources } from './auth-config';

// Import AuthService
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    HttpClientModule,
    //AppRoutingModule,
    MsalModule.forRoot(
      new PublicClientApplication(msalConfig),
      { interactionType: InteractionType.Redirect, authRequest: { scopes: protectedResources.api.scopes } },
      { interactionType: InteractionType.Redirect, protectedResourceMap: new Map([[protectedResources.api.endpoint, protectedResources.api.scopes]]) }
    )
  ],
  providers: [AuthService, MsalGuard],
  bootstrap: [MsalRedirectComponent]
})
export class AppModule { }
