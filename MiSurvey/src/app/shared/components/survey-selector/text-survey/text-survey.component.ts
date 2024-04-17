import { Component, Input } from '@angular/core';
import { SurveyResponseUtil } from '../../../../core/utils/survey-response.util';
import { Store } from '@ngrx/store';
import { customerFeedbackSelectors } from 'src/app/core/store/selectors';
@Component({
  selector: 'app-text-survey',
  templateUrl: './text-survey.component.html',
  styleUrls: ['./text-survey.component.scss'],
})
export class TextSurveyComponent {
  @Input() question: string = '';
  @Input() buttonTextColor: string = '';
  @Input() surveyId: number | undefined;
  @Input() questionId: number | undefined;

  textResponse: string | undefined = '' ;

  constructor(private store: Store, private responseUtil: SurveyResponseUtil) {}

  ngOnInit() {
    if (this.questionId) {
      this.store.select(customerFeedbackSelectors.selectSurveyResponse(this.questionId)).subscribe((response) => {
        this.textResponse = response ? response.ResponseValue : '';
      });
    }
  }

  updateResponse() {
    this.responseUtil.setResponse(this.questionId!, this.textResponse);
  }
}
