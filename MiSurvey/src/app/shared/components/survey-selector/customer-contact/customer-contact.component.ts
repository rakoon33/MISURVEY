import { ContactDataUtil } from './../../../../core/utils/contact-data.util';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { customerFeedbackActions } from 'src/app/core/store/actions';

@Component({
  selector: 'app-customer-contact',
  templateUrl: './customer-contact.component.html',
  styleUrls: ['./customer-contact.component.scss']
})
export class CustomerContactComponent {
  @Input() message: string = 'Would you please leave your contact information there, our customer service will contact to you at right time?';
  @Input() backgroundColor: string = '#E03616'; 

  fullName: string = '';
  phoneNumber: string = '';
  email: string = '';

  constructor(private ContactDataUtil: ContactDataUtil) {}

  updateContactInfo() {
    this.ContactDataUtil.setContactData({
      FullName: this.fullName,
      PhoneNumber: this.phoneNumber,
      Email: this.email
    });
  }

}
