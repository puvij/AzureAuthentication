import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Mango Azure UI';
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(private authService: AuthService, private broadcastService: MsalBroadcastService) { }

  ngOnInit(): void {
    // ✅ Ensure MSAL handles redirect & resets authentication state
    this.authService.instance.handleRedirectPromise().then(() => {
      this.authService.setInteractionInProgress(false); // ✅ Reset auth state
      this.setLoginDisplay();
    });

    // ✅ Listen for authentication status updates
    this.broadcastService.inProgress$
      .pipe(filter(status => status === InteractionStatus.None), takeUntil(this._destroying$))
      .subscribe(() => {
        this.authService.setInteractionInProgress(false); // ✅ Ensure auth state is cleared
        this.setLoginDisplay();
      });

    this.setLoginDisplay();
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }

  setLoginDisplay(): void {
    this.loginDisplay = this.authService.isLoggedIn();
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}
