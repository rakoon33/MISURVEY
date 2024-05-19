import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { surveyManagementActions } from 'src/app/core/store/actions';
import { surveyManagementSelector } from 'src/app/core/store/selectors';
import { SurveyManagementService } from 'src/app/core/services';
@Component({
  selector: 'app-question-configure',
  templateUrl: './question-configure.component.html',
  styleUrls: ['./question-configure.component.scss'],
})
export class QuestionConfigureComponent {
  currentType: 'text' | 'graphic' | 'numeric' = 'text';
  questionText: string = '';
  survey: any;
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
  editingQuestionId: number | null = null;
  addQuestionSurveyId: number | null = null;
  surveyId: number = 0;
  canEditType = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private surveyManagementService: SurveyManagementService
  ) {
    this.subscription.add(
      this.store
        .select(surveyManagementSelector.selectLastQuestionText)
        .subscribe((text) => {
          this.questionText = text || '';
        })
    );

    this.store.select(surveyManagementSelector.selectSurveyValue).subscribe(survey => {
      if (survey && survey.SurveyQuestions) {
        const sortedQuestions = [...survey.SurveyQuestions].sort((a, b) => {
          const orderA = a.PageOrder !== undefined ? a.PageOrder : Number.MAX_SAFE_INTEGER;
          const orderB = b.PageOrder !== undefined ? b.PageOrder : Number.MAX_SAFE_INTEGER;
    
          return orderA - orderB;
        });
        this.survey = {
          ...survey,
          SurveyQuestions: sortedQuestions
        };
      }
    });

  }

  private mapQuestionTypeToOption(questionType: number): 'text' | 'stars' | 'thumbs' | 'smileys' | 'nps' | 'csat' {
    switch (questionType) {
      case 1:
        return 'stars';
      case 2:
        return 'thumbs';
      case 3:
        return 'smileys';
      case 4:
        return 'text';
      case 5:
        return 'nps';
      case 6:
        return 'csat';
      default:
        return 'text'; // Default case if question type is unknown
    }
  }

  private mapQuestionTypeToType(questionType: number): 'text' | 'graphic' | 'numeric' {
    if ([1, 2, 3].includes(questionType)) {
      return 'graphic';
    } else if ([5, 6].includes(questionType)) {
      return 'numeric';
    } else if (questionType === 4) {
      return 'text';
    } else {
      return 'text'; // Default case if question type is unknown
    }
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['edit'] === 'true' && params['question']) {
        const question = JSON.parse(params['question']); // Deserialize the string back to an object
        this.editingQuestionId = question.QuestionID;
        this.questionText = question.QuestionText;
        this.currentType = this.mapQuestionTypeToType(question.QuestionType);
        this.selectedOption = this.mapQuestionTypeToOption(question.QuestionType);
        this.surveyId = question.SurveyID;
      }

      this.surveyManagementService.checkIfQuestionHasResponses(this.editingQuestionId!)
      .subscribe(hasResponses => {
        this.canEditType = !hasResponses;
      });

      if (params['add'] === 'true' && params['surveyId']) {
        this.addQuestionSurveyId = params['surveyId'];
      }
    });
  
    this.isInitialized = true;
  }

  onQuestionTextChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.questionText = inputElement.value;
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

  saveSelection(): void {
    let questionType = this.mapOptionToQuestionType(this.selectedOption);
  
    if (this.editingQuestionId) {
      console.log('edit question');
      this.store.dispatch(
        surveyManagementActions.updateSurveyQuestion({
          questionId: this.editingQuestionId,
          questionText: this.questionText,
          questionType,
        })
      );

      this.store.dispatch(
        surveyManagementActions.updateSurveyRequest({
          surveyId: this.surveyId,
          surveyData: this.survey
        })
      )

      this.router.navigate(['/survey-management/survey-detailed', this.surveyId]);
    } else {

      this.store.dispatch(
        surveyManagementActions.addSurveyQuestionType({
          questionText: this.questionText,
          questionType,
        })
      );

      if (this.addQuestionSurveyId)
      {
        console.log('add question');
        this.store.dispatch(
          surveyManagementActions.updateSurveyRequest({
            surveyId: this.addQuestionSurveyId,
            surveyData: this.survey
          })
        )
        this.router.navigate(['/survey-management/survey-detailed', this.addQuestionSurveyId]);
      } else {
        console.log('create survey');
        this.store.dispatch(surveyManagementActions.createSurveyRequest());
      }
      
    }
  
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
    this.addQuestionSurveyId = null;
    this.editingQuestionId = null;
  }
}
