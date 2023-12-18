import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-csat-survey',
  templateUrl: './csat-survey.component.html',
  styleUrls: ['./csat-survey.component.scss']
})
export class CsatSurveyComponent {
  @Input() question: string = '';
  csatScore: number | null = null;

  setScore(score: number) {
    this.csatScore = score;
  }
}
