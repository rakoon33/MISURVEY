import { ContactDataUtil } from './../../core/utils/contact-data.util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs';
import { customerSurveyActions } from 'src/app/core/store/actions';
import {
  customerFeedbackSelectors,
  customerSurveySelector,
} from 'src/app/core/store/selectors';
import { FeedbackResponse } from 'src/app/core/models';
import { customerFeedbackActions } from 'src/app/core/store/actions';
import { SurveyResponseUtil } from 'src/app/core/utils/survey-response.util';
import { ToastrService } from 'ngx-toastr';
import { SurveyManagementService } from 'src/app/core/services';
@Component({
  selector: 'app-customer-survey',
  templateUrl: './customer-survey.component.html',
  styleUrls: ['./customer-survey.component.scss'],
})
export class CustomerSurveyComponent {
  survey: any = null;
  currentQuestionIndex: number = 0;
  surveyLink: string = '';

  isSurveyCompleted = false;
  errorMessage: string | null = null;
  isResponseLimitReached = false;

  responseLimit: number = 0;
  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private responseUtil: SurveyResponseUtil,
    private contactDataUtil: ContactDataUtil,
    private toastrService: ToastrService,
    private surveyManagementService: SurveyManagementService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const link = params['SurveyLink'];

      if (link) {
        this.store.dispatch(
          customerSurveyActions.loadCustomerSurveyDetailRequest({ link })
        );
      }
    });

    this.store
      .select(customerSurveySelector.selectSurvey)
      .pipe(filter((survey) => !!survey))
      .subscribe((survey) => {
        if (
          survey &&
          survey.Approve === 'Yes' &&
          survey.SurveyStatus === 'Open'
        ) {
          this.survey = survey;

          this.surveyManagementService
            .getSurveyResponseCount(survey.SurveyID!)
            .subscribe({
              next: (response) => {
                this.responseLimit = response.responseLimit;
                if (response.count >= this.responseLimit) {
                  this.errorMessage = `This survey has reached the limit of ${this.responseLimit} responses.`;
                  this.isResponseLimitReached = true;
                  this.survey = null;
                }
              },
              error: () =>
                this.toastrService.error(
                  'Error checking survey response count.'
                ),
            });

          if (survey?.SurveyQuestions) {
            const sortedQuestions = [...survey.SurveyQuestions].sort((a, b) => {
              const orderA =
                a.PageOrder !== undefined
                  ? a.PageOrder
                  : Number.MAX_SAFE_INTEGER;
              const orderB =
                b.PageOrder !== undefined
                  ? b.PageOrder
                  : Number.MAX_SAFE_INTEGER;

              return orderA - orderB;
            });

            this.survey = {
              ...survey,
              SurveyQuestions: sortedQuestions,
            };
          }
        } else {
          this.errorMessage = 'This survey is currently unavailable.';
          if (survey!.Approve !== 'Yes') {
            this.errorMessage = 'This survey has not been approved yet.';
          }
          if (survey!.SurveyStatus !== 'Open') {
            this.errorMessage += ' Additionally, the survey is not open.';
          }
          this.survey = null;
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
    if (this.currentQuestionIndex < this.survey.SurveyQuestions.length) {
      const currentQuestion =
        this.survey.SurveyQuestions[this.currentQuestionIndex];
      const questionType = this.getSurveyTypeName(currentQuestion.QuestionType);

      // Chỉ lấy và dispatch câu trả lời nếu đây là câu hỏi kiểu text
      if (questionType === 'text') {
        const response = this.responseUtil.getResponse(
          currentQuestion.QuestionID
        );

        if (response) {
          this.store.dispatch(
            customerFeedbackActions.addSurveyResponse({
              response: {
                SurveyID: this.survey.SurveyID,
                QuestionID: currentQuestion.QuestionID,
                ResponseValue: response,
              },
            })
          );
        }
      }
      this.currentQuestionIndex++;
    }
  }

  goToPreviousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitSurvey() {
    this.surveyManagementService
      .getSurveyResponseCount(this.survey.SurveyID)
      .subscribe({
        next: (response) => {
          if (response.count >= this.responseLimit) {
            this.toastrService.error(
              `This survey has reached the limit of ${this.responseLimit} responses.`
            );
          } else {
            this.store
              .select(customerFeedbackSelectors.getSurveyResponses)
              .pipe(
                take(1) // Complete the subscription after the first value
              )
              .subscribe((responses) => {
                // Check if at least one question has been answered
                const hasAnsweredQuestion = responses.some(
                  (response) =>
                    response.ResponseValue &&
                    response.ResponseValue.trim() !== ''
                );

                if (!hasAnsweredQuestion) {
                  this.toastrService.error(
                    'Please answer at least one question before submitting the survey.'
                  );
                  return;
                }

                // Ensure contact info is set
                this.contactDataUtil
                  .getContactData()
                  .subscribe((contactInfo) => {
                    if (contactInfo) {
                      this.store.dispatch(
                        customerFeedbackActions.setContactInfo({ contactInfo })
                      );
                    }
                  });

                // Fetch contact info and submit the responses and contact info
                this.store
                  .select(customerFeedbackSelectors.getContactInfo)
                  .pipe(
                    filter((contactInfo) => contactInfo !== null), // Ensure contact info is not null
                    take(1),
                    map((contactInfo) => ({ responses, contactInfo })) // Pass the responses and contact info
                  )
                  .subscribe(({ responses, contactInfo }) => {
                    // Ensure that contact info is not null when dispatching
                    if (contactInfo) {
                      this.store.dispatch(
                        customerFeedbackActions.submitSurveyResponses({
                          contactInfo,
                          response: responses, // Ensure this matches the action's expected parameter
                        })
                      );

                      this.isSurveyCompleted = true;
                      this.currentQuestionIndex =
                        this.survey.SurveyQuestions.length + 1; // Move to the thank you message
                    } else {
                      // Optionally handle the error state if contact info is missing
                      console.error('Contact information is missing.');
                    }
                  });
              });
          }
        },
        error: () =>
          this.toastrService.error('Error checking survey response count.'),
      });
  }

  handleAnswerSelected(response: FeedbackResponse) {
    this.store.dispatch(
      customerFeedbackActions.addSurveyResponse({ response })
    );
  }
}
