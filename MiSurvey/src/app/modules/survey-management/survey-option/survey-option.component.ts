import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { surveyManagementActions } from 'src/app/core/store/actions';
@Component({
  selector: 'app-survey-option',
  templateUrl: './survey-option.component.html',
  styleUrls: ['./survey-option.component.scss']
})
export class SurveyOptionComponent {
  constructor(private store: Store, private router: Router) {}

  selectMethod(method: string) {
    this.store.dispatch(surveyManagementActions.setInvitationMethod({ method }));
    this.router.navigate(['/survey-management/survey']);
  }
}
