import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent), canActivate: [MsalGuard] }, 
  { path: '**', redirectTo: '/' } // ✅ Catch unknown routes
];
