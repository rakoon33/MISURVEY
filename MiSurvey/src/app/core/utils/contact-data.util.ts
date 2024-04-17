import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactDataUtil {
  private contactData = new BehaviorSubject<{FullName: string, PhoneNumber: string, Email: string}>({
    FullName: '',
    PhoneNumber: '',
    Email: ''
  });
  
  setContactData(data: {FullName: string, PhoneNumber: string, Email: string}) {
    this.contactData.next(data);
  }

  getContactData() {
    return this.contactData.asObservable();
  }
}
