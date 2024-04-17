import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FeedbackResponse } from 'src/app/core/models';
import { customerFeedbackSelectors } from 'src/app/core/store/selectors';

@Component({
  selector: 'app-nps-survey',
  templateUrl: './nps-survey.component.html',
  styleUrls: ['./nps-survey.component.scss'],
})
export class NpsSurveyComponent implements OnInit {
  npsScore: number | null = null;
  @Input() question: string = '';
  @Input() buttonTextColor: string = '';
  @Output() answerSelected = new EventEmitter<FeedbackResponse>();
  @Input() surveyId: number | undefined;
  @Input() questionId: number | undefined;

  constructor(private store: Store) {}

  ngOnInit() {
    if (this.questionId) {
      this.store.select(customerFeedbackSelectors.selectSurveyResponse(this.questionId)).subscribe((response) => {
        if (response && response.ResponseValue) {
          this.npsScore = parseInt(response.ResponseValue, 10);
        }
      });
    }
  }

  setScore(score: number) {
    this.npsScore = score;
    const response: FeedbackResponse = {
      SurveyID: this.surveyId,
      QuestionID: this.questionId,
      ResponseValue: score.toString(),
    };
    this.answerSelected.emit(response);
  }
}
