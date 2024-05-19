import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from '../../../core/store/actions'; // Update with the correct path
import { AppState } from '../../../core/store/app.state'; // Update with the correct path
import { Subscription } from 'rxjs';
import { HeaderComponent } from '@coreui/angular';
import { authSelector, userSelector } from '../../../core/store/selectors'; // Update with the correct path
import { NotificationService } from 'src/app/core/services';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnDestroy {
  @Input() sidebarId: string = 'sidebar';
  private subscription = new Subscription();

  // notifications sidebar
  public unreadCount = 0;
  public showNotificationSidebar = false;
  public userRole: string = '';
  public userName: string = '';
  @Output() onToggleNotifications = new EventEmitter<void>();

  avatarSrc: string = './assets/img/avatars/default.jpg';

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {
    super();

    // Subscribe to get avatar and role from state
    this.subscription.add(
      this.store.select(userSelector.selectCurrentUser).subscribe((user) => {
        if (user) {
          if (user.UserAvatar) {
            this.avatarSrc = user.UserAvatar;
          }
          this.userRole = user.UserRole;
          this.userName = user.Username; // Assuming the user object has a UserName property
          if (this.userRole !== 'SuperAdmin') {
            this.fetchUnreadCount();
          }
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

  toggleNotificationSidebar(event: MouseEvent): void {
    event.stopPropagation(); // Prevents the click event from bubbling up to the parent elements
    this.onToggleNotifications.emit();
  }
  
  fetchUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (data) => this.unreadCount = data.count,
      error: (error) => console.error('Error fetching unread notifications count', error)
    });
  }

  logout(): void {
    this.store.dispatch(authActions.logoutRequest());
    window.location.reload();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
