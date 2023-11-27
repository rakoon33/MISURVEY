import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { authActions } from '../../../core/store/actions'; // Update with the correct path
import { AppState } from '../../../core/store/app.state'; // Update with the correct path
import { Subscription } from 'rxjs';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import {authSelector} from '../../../core/store/selectors'; // Update with the correct path

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnDestroy {

  @Input() sidebarId: string = "sidebar";
  private subscription = new Subscription();

  constructor(
    private classToggler: ClassToggleService,
    private toastr: ToastrService,
    private router: Router,
    private store: Store<AppState>
  ) {
    super();

    // Subscribe to auth state changes
    this.subscription.add(
      this.store.select(authSelector.selectCurrentAuth).subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          this.clearLocalStorage();
          this.toastr.success("Logged out successfully");
          this.router.navigate(['/login']);
        }
      })
    );

    this.subscription.add(
      this.store.select(authSelector.selectIsAuthError).subscribe(error => {
        if (error) {
          this.toastr.error('Failed to log out');
        }
      })
    );
  }

  logout(): void {
    this.toastr.error('log out');
    this.store.dispatch(authActions.logoutRequest());
    window.location.reload();
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}