import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nps-survey',
  templateUrl: './nps-survey.component.html',
  styleUrls: ['./nps-survey.component.scss']
})
export class NpsSurveyComponent {
  @Input() question: string = '';
  @Input() buttonTextColor: string = '';
  npsScore: number | null = null;

  
  setScore(score: number) {
    this.npsScore = score;
  }
}
