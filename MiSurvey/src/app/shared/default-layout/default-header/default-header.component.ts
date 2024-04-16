import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from '../../../core/store/actions'; // Update with the correct path
import { AppState } from '../../../core/store/app.state'; // Update with the correct path
import { Subscription, skip } from 'rxjs';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { authSelector, userSelector } from '../../../core/store/selectors'; // Update with the correct path

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent
  extends HeaderComponent
  implements OnDestroy
{
  @Input() sidebarId: string = 'sidebar';
  private subscription = new Subscription();

  avatarSrc: string = './assets/img/avatars/default.jpg';

  constructor(private router: Router, private store: Store<AppState>) {
    super();

       // Đăng ký để lấy avatar từ state
       this.subscription.add(
        this.store.select(userSelector.selectCurrentUser).subscribe((user) => {
          if (user && user.UserAvatar) {
            this.avatarSrc = user.UserAvatar;
          }
        })
      );
      
    // Subscribe to auth state changes
    this.subscription.add(
      this.store
        .select(authSelector.selectCurrentAuth)
        .subscribe((isAuthenticated) => {
          if (!isAuthenticated) {
            this.router.navigate(['/login']);
          }
        })
    );
  }

  logout(): void {
    this.store.dispatch(authActions.logoutRequest());
    window.location.reload();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
