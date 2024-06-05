import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { QuestionTemplateService } from '../../services';
import * as QuestionTemplateActions from '../actions/question-template.actions';
import { questionTemplateActions } from '../actions';
import { Store } from '@ngrx/store';

@Injectable()
export class QuestionTemplateEffects { 
    loadQuestionTemplates$ = createEffect(() =>
        this.actions$.pipe(
          ofType(QuestionTemplateActions.loadQuestionTemplatesRequest),
          switchMap((action) =>
            this.questionTemplateService.getQuestionTemplates().pipe(
              map((response) => {
                const templates = response.templates; 
                return QuestionTemplateActions.loadQuestionTemplatesSuccess({
                  questionTemplates: templates,
                });
              }),
              catchError((error) => of(QuestionTemplateActions.loadQuestionTemplatesFailure()))
            )
          )
        )
      );

  loadQuestionTemplateById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionTemplateActions.loadQuestionTemplateByIdRequest),
      switchMap((action) =>
        this.questionTemplateService.getQuestionTemplateById(action.templateId).pipe(
          map((questionTemplate) =>
            QuestionTemplateActions.loadQuestionTemplateByIdSuccess({ questionTemplate })
          ),
          catchError((error) => of(QuestionTemplateActions.loadQuestionTemplateByIdFailure()))
        )
      )
    )
  );

  searchQuestionTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionTemplateActions.searchQuestionTemplatesRequest),
      switchMap((action) =>
        this.questionTemplateService.searchQuestionTemplates(action.searchTerm).pipe(
          map((searchResults) =>
            QuestionTemplateActions.searchQuestionTemplatesSuccess({ searchResults })
          ),
          catchError((error) => of(QuestionTemplateActions.searchQuestionTemplatesFailure()))
        )
      )
    )
  );

  createQuestionTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionTemplateActions.createQuestionTemplateRequest),
      switchMap((action) =>
        this.questionTemplateService.createQuestionTemplate(action.templateData).pipe(
          map((response) => {
            if (response.status) {
              this.toastrService.success(response.message || 'Template created successfully');
              this.store.dispatch(
                questionTemplateActions.loadQuestionTemplatesRequest()
              );
              return QuestionTemplateActions.createQuestionTemplateSuccess({ questionTemplate: response.template });
            } else {
              this.toastrService.error(response.message || 'Failed to create template');
              return QuestionTemplateActions.createQuestionTemplateFailure();
            }
          }),
          catchError((error) => {
            this.toastrService.error('Network or server error while creating template');
            return of(QuestionTemplateActions.createQuestionTemplateFailure());
          })
        )
      )
    )
  );
  
  updateQuestionTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionTemplateActions.updateQuestionTemplateRequest),
      switchMap((action) =>
        this.questionTemplateService.updateQuestionTemplate(action.templateId, action.templateData).pipe(
          map((response) => {
            if (response.status) {
              this.toastrService.success(response.message || 'Template updated successfully');
              this.store.dispatch(
                questionTemplateActions.loadQuestionTemplatesRequest()
              );
              return QuestionTemplateActions.updateQuestionTemplateSuccess();
            } else {
              this.toastrService.error(response.message || 'Failed to update template');
              return QuestionTemplateActions.updateQuestionTemplateFailure();
            }
          }),
          catchError((error) => {
            this.toastrService.error('Network or server error while updating template');
            return of(QuestionTemplateActions.updateQuestionTemplateFailure());
          })
        )
      )
    )
  );
  
  deleteQuestionTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionTemplateActions.deleteQuestionTemplateRequest),
      switchMap((action) =>
        this.questionTemplateService.deleteQuestionTemplate(action.templateId).pipe(
          map((response) => {
            if (response.status) {
              this.toastrService.success(response.message || 'Template deleted successfully');
              this.store.dispatch(
                questionTemplateActions.loadQuestionTemplatesRequest()
              );
              return QuestionTemplateActions.deleteQuestionTemplateSuccess();
            } else {
              this.toastrService.error(response.message || 'Failed to delete template');
              return QuestionTemplateActions.deleteQuestionTemplateFailure();
            }
          }),
          catchError((error) => {
            this.toastrService.error('Network or server error while deleting template');
            return of(QuestionTemplateActions.deleteQuestionTemplateFailure());
          })
        )
      )
    )
  );  

  constructor(
    private actions$: Actions,
    private questionTemplateService: QuestionTemplateService,
    private toastrService: ToastrService,
    private store: Store
  ) {}
}
