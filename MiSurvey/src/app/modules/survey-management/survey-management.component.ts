import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { surveyManagementActions } from 'src/app/core/store/actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { surveyManagementSelector } from 'src/app/core/store/selectors';
@Component({
  selector: 'app-survey-management',
  templateUrl: './survey-management.component.html',
  styleUrls: ['./survey-management.component.scss'],
  providers: [DatePipe],
})
export class SurveyManagementComponent implements OnInit {
  surveys$: Observable<any[]>;

  constructor(
    private router: Router,
    private store: Store
  ) {

    this.surveys$ = this.store.select(surveyManagementSelector.selectAllSurveys);
  }

  ngOnInit(): void {
    this.store.dispatch(surveyManagementActions.fetchSurveysRequest());
  }

  copySurveyLink(link: string, event: MouseEvent) {
    event.preventDefault();   
    navigator.clipboard.writeText(link).then(
      () => {
        console.log('Link copied to clipboard!');
      },
      err => {
        console.error('Error copying link: ', err);
      }
    );
  }

  navigateToCreateSurvey() {
    this.store.dispatch(surveyManagementActions.resetSurveyState());
    this.router.navigate(['/survey-management/survey-method']);
  }

  navigateToSurveyDetails(surveyId: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/survey-management/survey-detailed', surveyId]);
  }

}