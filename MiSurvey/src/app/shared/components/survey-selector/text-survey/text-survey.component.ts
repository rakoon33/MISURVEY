import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-survey',
  templateUrl: './text-survey.component.html',
  styleUrls: ['./text-survey.component.scss']
})
export class TextSurveyComponent {
  @Input() question: string = '';
  @Input() buttonTextColor: string = '';

  textResponse: string = '';
}
