import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { FeedbackResponse } from 'src/app/core/models';
import { customerFeedbackSelectors } from 'src/app/core/store/selectors';

@Component({
  selector: 'app-csat-survey',
  templateUrl: './csat-survey.component.html',
  styleUrls: ['./csat-survey.component.scss'],
})
export class CsatSurveyComponent {
  @Input() question: string = '';
  @Input() buttonTextColor: string = '';
  @Input() surveyId: number | undefined;
  @Input() questionId: number | undefined;
  csatScore: number | null = null;

  @Output() answerSelected = new EventEmitter<FeedbackResponse>();


  constructor(private store: Store) {}

  ngOnInit() {
    if (this.questionId) {
      this.store.select(customerFeedbackSelectors.selectSurveyResponse(this.questionId)).subscribe((response) => {
        if (response && response.ResponseValue) {
          this.csatScore = parseInt(response.ResponseValue, 10);
        } else {
          this.csatScore = null;
        }
      });
    }
  }

  setScore(score: number) {
    this.csatScore = score;
    const response: FeedbackResponse = {
      SurveyID: this.surveyId,
      QuestionID: this.questionId,
      ResponseValue: this.csatScore.toString(),
    };
    this.answerSelected.emit(response);
  }
}
