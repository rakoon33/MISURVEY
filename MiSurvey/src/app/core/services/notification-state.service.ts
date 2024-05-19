import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationStateService {
  private unreadCountSubject = new BehaviorSubject<number>(0);

  getUnreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  setUnreadCount(count: number): void {
    this.unreadCountSubject.next(count);
  }
}