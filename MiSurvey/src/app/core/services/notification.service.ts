import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  getNotifications(): Observable<any> {
    const notificationsUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/notification`;
    return this.http.get(notificationsUrl, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error fetching notifications:', error);
        return throwError(() => error);
      })
    );
  }

  getUnreadCount(): Observable<any> {
    const unreadCountUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/notification/count-unread`;
    return this.http.get(unreadCountUrl, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error fetching unread notification count:', error);
        return throwError(() => error);
      })
    );
  }

  updateNotificationStatus(notificationId: number, status: string): Observable<any> {
    const updateUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/notification/notification-status/${notificationId}`;
    return this.http.put(updateUrl, { status }, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error updating notification status:', error);
        return throwError(() => error);
      })
    );
  }

}