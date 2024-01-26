import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-survey-selector',
  templateUrl: './survey-selector.component.html',
  styleUrls: ['./survey-selector.component.scss']
})
export class SurveySelectorComponent {

  @Input() borderTopColor: string = '#000';
  @Input() title: string = '';
  @Input() question: string = '';
  @Input() selectedSurveyType: string = 'nps';
  @Input() buttonTextColor: string = '#000000';
  @Input() selectedImage: string | ArrayBuffer | null = null; 
  @Input() message: string = '';
}
