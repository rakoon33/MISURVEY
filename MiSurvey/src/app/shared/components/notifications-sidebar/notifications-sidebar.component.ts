import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationService } from '../../../core/services';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../../core/services/socket.service';
import { AppState } from '../../../core/store/app.state';
import { companySelector } from 'src/app/core/store/selectors';

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
    private socketService: SocketService
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
    // Add the new notification to the top of the list
    this.notifications.unshift(notification);

    // Optionally, sort notifications by CreatedAt if needed
    this.notifications.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());

    // Trigger change detection
    this.cdr.detectChanges();

    // Show toast notification
    this.toastr.info(notification.Message, 'New Notification');
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
    unreadNotifications.forEach(notification => {
      this.notificationService.updateNotificationStatus(notification.NotificationID, 'Read').subscribe({
        next: () => {
          notification.NotificationStatus = 'Read';
          this.cdr.detectChanges();
        },
        error: (error) => console.error('Error updating notification status', error)
      });
    });
  }

  // Listen to click events on the document
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // If clicks are inside the sidebar, do nothing
    if (this.elRef.nativeElement.contains(event.target)) {
      return;
    }
    // If sidebar is visible and clicks are outside, hide the sidebar
    if (this.isVisible) {
      this.toggleVisibility();
    }
  }
}
