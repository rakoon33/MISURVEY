import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-customer-contact',
  templateUrl: './customer-contact.component.html',
  styleUrls: ['./customer-contact.component.scss']
})
export class CustomerContactComponent {
  @Input() message: string = 'Would you please leave your contact information there, our customer service will contact to you at right time?';
  @Input() backgroundColor: string = '#E03616'; 
}
