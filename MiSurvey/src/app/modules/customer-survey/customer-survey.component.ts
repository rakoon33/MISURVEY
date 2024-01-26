import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { customerSurveyActions } from 'src/app/core/store/actions';
import { customerSurveySelector } from 'src/app/core/store/selectors';
@Component({
  selector: 'app-customer-survey',
  templateUrl: './customer-survey.component.html',
  styleUrls: ['./customer-survey.component.scss'],
})
export class CustomerSurveyComponent {
  survey: any = null;
  currentQuestionIndex: number = 0;
  surveyLink: string = '';
  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('haha');
    this.route.params.subscribe((params) => {
      // const link = params['SurveyLink'];

      const link = 'gt6kKERXLepBQa0xKm1km';
      if (link) {
        this.store.dispatch(
          customerSurveyActions.loadCustomerSurveyDetailRequest({ link })
        );
      }
    });

    this.store
    .select(customerSurveySelector.selectSurvey)
    .subscribe((survey) => {
      if (survey && survey.SurveyQuestions) {
        // Create a copy of the SurveyQuestions array
        const sortedQuestions = [...survey.SurveyQuestions].sort((a, b) => {
          const orderA =
            a.PageOrder !== undefined ? a.PageOrder : Number.MAX_SAFE_INTEGER;
          const orderB =
            b.PageOrder !== undefined ? b.PageOrder : Number.MAX_SAFE_INTEGER;

          return orderA - orderB;
        });

        // Assign the sorted array to a new property or modify the existing survey object
        this.survey = {
          ...survey,
          SurveyQuestions: sortedQuestions,
        };

        console.log(this.survey);
      }
    });
  }

  getSurveyTypeName(questionType: number): string {
    switch (questionType) {
      case 1:
        return 'stars';
      case 2:
        return 'thumbs';
      case 3:
        return 'emoticons';
      case 4:
        return 'text';
      case 5:
        return 'nps';
      case 6:
        return 'csat';
      default:
        return 'unknown';
    }
  }

  goToNextQuestion() {
    if (this.currentQuestionIndex < this.survey.SurveyQuestions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  goToPreviousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }
}
