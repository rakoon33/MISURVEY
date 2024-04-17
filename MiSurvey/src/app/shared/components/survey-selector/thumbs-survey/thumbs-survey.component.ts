import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { FeedbackResponse } from 'src/app/core/models';
import { customerFeedbackSelectors } from 'src/app/core/store/selectors';

@Component({
  selector: 'app-thumbs-survey',
  templateUrl: './thumbs-survey.component.html',
  styleUrls: ['./thumbs-survey.component.scss']
})
export class ThumbsSurveyComponent {
  @Input() question: string = '';
  @Input() buttonTextColor: string = '';
  thumbsUpSelected: boolean | null = null;
  @Input() surveyId: number | undefined;
  @Input() questionId: number | undefined;

  @Output() answerSelected = new EventEmitter<FeedbackResponse>();

  constructor(private store: Store) {}

  ngOnInit() {
    if (this.questionId) {
      this.store.select(customerFeedbackSelectors.selectSurveyResponse(this.questionId)).subscribe((response) => {
        if (response) {
          this.thumbsUpSelected = response.ResponseValue === 'true';
        }
      });
    }
  }
  
  setScore(score: boolean) {
    this.thumbsUpSelected  = score;
    const response: FeedbackResponse = {
      SurveyID: this.surveyId,
      QuestionID: this.questionId,
      ResponseValue: this.thumbsUpSelected.toString(),
    };

    this.answerSelected.emit(response);
  }
}
  