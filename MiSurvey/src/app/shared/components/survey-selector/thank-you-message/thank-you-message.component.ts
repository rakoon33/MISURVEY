import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-thank-you-message',
  templateUrl: './thank-you-message.component.html',
  styleUrls: ['./thank-you-message.component.scss']
})
export class ThankYouMessageComponent {
  @Input() message: string = 'Thank you for your response!';
}
