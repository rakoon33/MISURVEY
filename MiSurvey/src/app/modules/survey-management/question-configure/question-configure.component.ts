import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { surveyManagementActions } from 'src/app/core/store/actions';
import { surveyManagementSelector } from 'src/app/core/store/selectors';
import {
  userManagementSelector,
  userSelector,
} from 'src/app/core/store/selectors';
@Component({
  selector: 'app-question-configure',
  templateUrl: './question-configure.component.html',
  styleUrls: ['./question-configure.component.scss'],
})
export class QuestionConfigureComponent {
  currentType: 'text' | 'graphic' | 'numeric' = 'text';
  questionText: string = '';

  public selectedOption:
    | 'text'
    | 'stars'
    | 'thumbs'
    | 'smileys'
    | 'csat'
    | 'nps' = 'text';

  private subscription = new Subscription();
  hasSaved: boolean = false;
  isInitialized: boolean = false;
  constructor(private store: Store, private router: Router) {
    this.subscription.add(
      this.store
        .select(surveyManagementSelector.selectLastQuestionText)
        .subscribe((text) => {
          this.questionText = text || '';
        })
    );
  }

  ngOnInit() {
    this.isInitialized = true;
  }

  changeType(event: Event): void {
    const select = event.target as HTMLSelectElement; // Type assertion
    const type = select.value;

    if (type === 'text' || type === 'graphic' || type === 'numeric') {
      this.currentType = type;
    }
  }

  selectOption(
    option: 'text' | 'stars' | 'thumbs' | 'smileys' | 'csat' | 'nps'
  ): void {
    this.selectedOption = option;
  }

  // saveSelection(): void {
  //   let questionType = this.mapOptionToQuestionType(this.selectedOption);

  //   this.store.dispatch(
  //     surveyManagementActions.addSurveyQuestionType({
  //       questionText: this.questionText,
  //       questionType,
  //     })
  //   );

  //   this.hasSaved = true;
  // }

  saveSelection(): void {
    let questionType = this.mapOptionToQuestionType(this.selectedOption);

    // First, add the question type to the store
    this.store.dispatch(
      surveyManagementActions.addSurveyQuestionType({
        questionText: this.questionText,
        questionType,
      })
    );

    this.store.select(surveyManagementSelector.selectSurveyValue).subscribe(survey => {
      console.log('Survey Data:', survey);
    })

    this.store.dispatch(surveyManagementActions.createSurveyRequest());

    this.hasSaved = true;
  }

  clearQuestionText(): void {
    this.store.dispatch(surveyManagementActions.clearUnsavedQuestionText());
  }

  mapOptionToQuestionType(
    option: 'stars' | 'thumbs' | 'smileys' | 'text' | 'nps' | 'csat'
  ): number {
    switch (option) {
      case 'stars':
        return 1;
      case 'thumbs':
        return 2;
      case 'smileys':
        return 3;
      case 'text':
        return 4;
      case 'nps':
        return 5;
      case 'csat':
        return 6;
      default:
        return 1;
    }
  }

  ngOnDestroy() {
    // Only clear the question text if the component has been initialized and not saved
    if (this.isInitialized && !this.hasSaved) {
      this.clearQuestionText();
    }
    this.subscription.unsubscribe();
    this.isInitialized = false;
  }
}
