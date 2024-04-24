import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { surveyManagementActions } from 'src/app/core/store/actions';
import { surveyManagementSelector } from 'src/app/core/store/selectors';
import { ToastrService } from 'ngx-toastr';

import { QuestionTemplate } from 'src/app/core/models';
import { questionTemplateActions } from 'src/app/core/store/actions';
import { questionTemplateSelectors } from 'src/app/core/store/selectors';
import { ModalService } from '@coreui/angular';

@Component({
  selector: 'app-question-to-ask',
  templateUrl: './question-to-ask.component.html',
  styleUrls: ['./question-to-ask.component.scss'],
})
export class QuestionToAskComponent {
  questionCount$: Observable<number>;

  questionTemplates$: Observable<QuestionTemplate[]> = this.store.select(
    questionTemplateSelectors.selectAllQuestionTemplates
  );
  filteredQuestionTemplates$: Observable<QuestionTemplate[]>;

  selectedTemplate: QuestionTemplate | null = null;

  survey: any;

  constructor(
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: ModalService
  ) {
    this.questionCount$ = this.store.select(
      surveyManagementSelector.selectQuestionsCount
    );

    // Dispatch an action to load questions if needed
    this.store.dispatch(
      questionTemplateActions.loadQuestionTemplatesRequest({
        page: 1,
        pageSize: 100,
      })
    );
    this.filteredQuestionTemplates$ = this.questionTemplates$;

    this.store
      .select(surveyManagementSelector.selectSurveyValue)
      .subscribe((survey) => {
        if (survey && survey.SurveyQuestions) {
          const sortedQuestions = [...survey.SurveyQuestions].sort((a, b) => {
            const orderA =
              a.PageOrder !== undefined ? a.PageOrder : Number.MAX_SAFE_INTEGER;
            const orderB =
              b.PageOrder !== undefined ? b.PageOrder : Number.MAX_SAFE_INTEGER;

            return orderA - orderB;
          });
          this.survey = {
            ...survey,
            SurveyQuestions: sortedQuestions,
          };
        }
      });
  }
  pageId: number = 1;
  questionText: string = '';
  surveyId: number | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['add'] === 'true' && params['surveyId']) {
        this.surveyId = params['surveyId'];
      }
    });
  }

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

    if (this.surveyId) {
      this.router.navigate(['/survey-management/question/configure'], {
        queryParams: { add: true, surveyId: this.surveyId },
      });
    } else {
      this.router.navigate(['/survey-management/question/configure']);
    }
  }

  openRecommendedQuestionsModal() {
    this.modalService.toggle({ show: true, id: 'recommendedQuestionsModal' });
  }

  filterQuestionsByCategory(category: string) {
    if (category === 'ALL') {
      this.filteredQuestionTemplates$ = this.questionTemplates$;
    } else {
      this.filteredQuestionTemplates$ = this.store
        .select(questionTemplateSelectors.selectAllQuestionTemplates)
        .pipe(
          map((questions) =>
            questions.filter((q) => q.TemplateCategory === category)
          )
        );
    }
  }

  confirmQuestion() {
    this.modalService.toggle({ show: false, id: 'confirmSelectionModal' });

    // If a question template is selected
    if (this.selectedTemplate) {
      const questionType = this.selectedTemplate.SurveyType.SurveyTypeID;

      if (this.surveyId) {
        this.store.dispatch(
          surveyManagementActions.addSurveyQuestionType({
            questionText: this.questionText,
            questionType,
          })
        );
        this.store.dispatch(
          surveyManagementActions.updateSurveyRequest({
            surveyId: this.surveyId,
            surveyData: this.survey,
          })
        );
        this.router.navigate([
          '/survey-management/survey-detailed',
          this.surveyId,
        ]);

        // Navigate to the survey details page
        this.router.navigate([
          '/survey-management/survey-detailed',
          this.surveyId,
        ]);
      } else {
        this.store.dispatch(
          surveyManagementActions.addSurveyQuestion({
            questionText: this.questionText,
          })
        );

        this.store.dispatch(
          surveyManagementActions.addSurveyQuestionType({
            questionText: this.questionText,
            questionType: questionType,
          })
        );

        this.store.dispatch(surveyManagementActions.createSurveyRequest());
      }

      this.modalService.toggle({
        show: false,
        id: 'recommendedQuestionsModal',
      });
    }
  }

  selectQuestion(questionTemplate: QuestionTemplate) {
    this.selectedTemplate = questionTemplate;
    this.questionText = this.selectedTemplate.TemplateText;
    this.modalService.toggle({ show: true, id: 'confirmSelectionModal' });
  }
}
