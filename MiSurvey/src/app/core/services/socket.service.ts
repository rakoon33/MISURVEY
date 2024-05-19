import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {}

  joinRoom(companyID: string): void {
    this.socket.emit('joinRoom', companyID);
  }

  onNewNotification() {
    return this.socket.fromEvent('newNotification');
  }
}
