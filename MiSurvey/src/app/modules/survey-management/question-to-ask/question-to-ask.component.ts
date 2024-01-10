import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { surveyManagementActions } from 'src/app/core/store/actions';
import { surveyManagementSelector } from 'src/app/core/store/selectors';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-question-to-ask',
  templateUrl: './question-to-ask.component.html',
  styleUrls: ['./question-to-ask.component.scss'],
})
export class QuestionToAskComponent {
  questionCount$: Observable<number>;
  constructor(
    private store: Store,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.questionCount$ = this.store.select(
      surveyManagementSelector.selectQuestionsCount
    );
  }
  pageId: number = 1; 
  questionText: string = '';
  addQuestion() {
    if (this.questionText == null || this.questionText.trim() === '') {
      this.toastr.error('The question cannot be empty.');
      return;
    }

    this.store.dispatch(
      surveyManagementActions.addSurveyQuestion({
        questionText: this.questionText,
      })
    );
    this.router.navigate(['/survey-management/question/configure']);
  }
}
