import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FeedbackResponse } from 'src/app/core/models';
import { customerFeedbackSelectors } from 'src/app/core/store/selectors';

@Component({
  selector: 'app-emoticon-rating',
  templateUrl: './emoticon-rating.component.html',
  styleUrls: ['./emoticon-rating.component.scss']
})
export class EmoticonRatingComponent implements OnInit {
  @Input() question: string = '';
  @Input() buttonTextColor: string = '#000000';
  @Input() surveyId: number | undefined;
  @Input() questionId: number | undefined;
  @Output() answerSelected = new EventEmitter<FeedbackResponse>();

  emoticonRating: string | null = null;

  constructor(private store: Store) {}

  ngOnInit() {
    if (this.questionId) {
      this.store.select(customerFeedbackSelectors.selectSurveyResponse(this.questionId)).subscribe((response) => {
        if (response) {
          this.emoticonRating = response?.ResponseValue ?? null;
        }
      });
    }
  }

  setScore(score: string) {
    this.emoticonRating = score;
    const response: FeedbackResponse = {
      SurveyID: this.surveyId,
      QuestionID: this.questionId,
      ResponseValue: score
    };
    this.answerSelected.emit(response);
  }
}
