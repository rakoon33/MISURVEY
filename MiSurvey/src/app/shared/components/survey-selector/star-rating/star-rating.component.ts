import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { FeedbackResponse } from 'src/app/core/models';
import { customerFeedbackSelectors } from 'src/app/core/store/selectors';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input() question: string = '';
  @Input() buttonTextColor: string = '';
  @Input() surveyId: number | undefined;
  @Input() questionId: number | undefined;

  starRating: number | null = null;
  selectedStarColor: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['buttonTextColor']) {
      this.selectedStarColor = changes['buttonTextColor'].currentValue;
    }
  }

  @Output() answerSelected = new EventEmitter<FeedbackResponse>();

  setScore(score: number) {
    this.starRating = score;
    const response: FeedbackResponse = {
      SurveyID: this.surveyId,
      QuestionID: this.questionId,
      ResponseValue: this.starRating.toString(),
    };

    this.answerSelected.emit(response);
  }
}
