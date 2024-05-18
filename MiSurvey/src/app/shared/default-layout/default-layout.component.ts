import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { navItems as originalNavItems } from './_nav';
import { userSelector } from 'src/app/core/store/selectors';
import { Router } from '@angular/router';
import { NotificationsSidebarComponent } from '../components/notifications-sidebar/notifications-sidebar.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {
  public navItems: any[] | undefined; // Mảng các mục điều hướng
  userRole = '';
  @ViewChild(NotificationsSidebarComponent, { static: false })
  private notificationsSidebar!: NotificationsSidebarComponent;

  constructor(private store: Store, private router: Router) {}

  toggleNotificationsSidebar(): void {
    console.log('Toggling notifications sidebar');
    if (this.notificationsSidebar) {
      this.notificationsSidebar.toggleVisibility();
    }
  }

  ngOnInit(): void {
    this.store.select(userSelector.selectCurrentUser).subscribe((user) => {
      // Fetch user permissions
      if(user) {
        this.userRole = user.UserRole;
      }
      if (user && user.UserRole === 'Supervisor') {
        this.store
          .select(userSelector.selectCurrentUserPermissions)
          .subscribe((permissions) => {
            this.navItems = originalNavItems.filter((item) => {
              const permission = permissions?.find(
                (perm) => perm.module.ModuleName === item.name
              );
              return permission ? permission.CanView : false; // Allow only if CanView is true
            });

            // If dashboard is not viewable, navigate to the first item in navItems
            const dashboardPermission = permissions?.find(
              (perm) => perm.module.ModuleName === 'Dashboard'
            );
            if (!dashboardPermission?.CanView) {
              const firstNavItemPath = this.navItems[0]?.url || '/'; // Default to '/' if no items in navItems
              this.router.navigate([firstNavItemPath]);
            }
          });
      } else {
        // Handle other user roles
        if (user && user.UserRole === 'SuperAdmin') {
          this.navItems = originalNavItems.filter(
            (item) =>
              item.name !== 'Survey Management' &&
              item.name !== 'Role Management' &&
              item.name !== 'Customer Management' &&
              item.name !== 'Subscription Plans' &&
              item.name !== 'Report Management'
          );
        } else {
          this.navItems = originalNavItems.filter(
            (item) => item.name !== 'Question Management'
          );
        }
      }
    });
  }
}
