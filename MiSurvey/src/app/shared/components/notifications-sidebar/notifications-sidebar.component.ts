import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationService } from '../../../core/services';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../../core/services/socket.service';
import { AppState } from '../../../core/store/app.state';
import { companySelector } from 'src/app/core/store/selectors';
import { NotificationStateService } from '../../../core/services/notification-state.service';

@Component({
  selector: 'app-notifications-sidebar',
  templateUrl: './notifications-sidebar.component.html',
  styleUrls: ['./notifications-sidebar.component.scss']
})
export class NotificationsSidebarComponent implements OnInit {
  public isVisible: boolean = false;
  public notifications: any[] = [];
  private companyID: number | null = null;

  constructor(
    private store: Store<AppState>,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private elRef: ElementRef,
    private toastr: ToastrService,
    private socketService: SocketService,
    private notificationStateService: NotificationStateService
  ) {}

  ngOnInit(): void {
    this.store.select(companySelector.selectCompanyID).subscribe(companyID => {
      if (companyID) {
        this.companyID = companyID;
        this.socketService.joinRoom(companyID.toString());

        this.socketService.onNewNotification().subscribe((notification: any) => {
          console.log('New notification received:', notification);
          this.addNotification(notification);
        });

        this.fetchNotifications();
      }
    });
  }

  fetchNotifications(): void {
    if (this.companyID) {
      this.notificationService.getNotifications().subscribe({
        next: (data) => {
          this.notifications = data.data;
          this.cdr.detectChanges();
        },
        error: (error) => console.error('Error fetching notifications', error)
      });
    }
  }

  addNotification(notification: any): void {
    this.notifications.unshift(notification);
    this.notifications.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
    this.cdr.detectChanges();
    this.toastr.info(notification.Message, 'New Notification');
    this.fetchUnreadCount();
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    this.cdr.detectChanges();

    if (!this.isVisible) {
      this.markNotificationsAsRead();
    }
  }

  markNotificationsAsRead(): void {
    const unreadNotifications = this.notifications.filter(notification => notification.NotificationStatus === 'Unread');
    if (unreadNotifications.length > 0) {
      const updateObservables = unreadNotifications.map(notification => 
        this.notificationService.updateNotificationStatus(notification.NotificationID, 'Read')
      );

      Promise.all(updateObservables.map(obs => obs.toPromise())).then(() => {
        unreadNotifications.forEach(notification => notification.NotificationStatus = 'Read');
        this.cdr.detectChanges();
        this.fetchUnreadCount(); // Fetch unread count after marking notifications as read
      }).catch((error) => console.error('Error updating notification status', error));
    }
  }

  fetchUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (data) => {
        this.notificationStateService.setUnreadCount(data.count); // Update the shared state
      },
      error: (error) => console.error('Error fetching unread notifications count', error)
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.elRef.nativeElement.contains(event.target)) {
      return;
    }
    if (this.isVisible) {
      this.toggleVisibility();
    }
  }
}
