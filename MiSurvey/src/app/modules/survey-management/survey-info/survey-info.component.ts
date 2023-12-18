import { Component } from '@angular/core';

@Component({
  selector: 'app-survey-info',
  templateUrl: './survey-info.component.html',
  styleUrls: ['./survey-info.component.scss'],
})
export class SurveyInfoComponent {
  surveyTitle: string = '3N';
  topBarColor: string = '#BA3232'; 
  buttonTextColor: string = '#2f3c54'; 

  onFileSelected(event: Event): void {

  }

  importPeople(): void {

  }
}
