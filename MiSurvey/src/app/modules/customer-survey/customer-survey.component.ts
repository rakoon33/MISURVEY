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

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private responseUtil: SurveyResponseUtil,
    private contactDataUtil: ContactDataUtil,
    private toastrService: ToastrService
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
      .subscribe((survey) => {
console.log(survey);
        if (survey && survey.Approve === 'Yes' && survey.SurveyStatus === 'Open') {
          this.survey = survey;
          if (survey?.SurveyQuestions) {
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
  
          }
        } else {
          this.errorMessage = 'This survey is currently unavailable.';
          if (survey!.Approve !== 'Yes') {
            this.errorMessage = 'This survey has not been approved yet.';
          }
          if (survey!.SurveyStatus !== 'Open') {
            console.log(survey!.SurveyStatus)
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

      // Select the response for the current question from the store
      this.store
        .select(
          customerFeedbackSelectors.selectSurveyResponse(
            currentQuestion.QuestionID
          )
        )
        .pipe(
          take(1) // Take 1 to complete the subscription after the first received value
        )
        .subscribe((response) => {
          if (!response || !response.ResponseValue) {
            // Check if response exists and is valid
            this.toastrService.error('Please answer the current question before moving to the next.');
            return;
          } else {
            this.currentQuestionIndex++;
          }
        });
    }
  }

  goToPreviousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitSurvey() {
    // Ensure contact info is set
    this.contactDataUtil.getContactData().subscribe((contactInfo) => {
      if (contactInfo) {
        this.store.dispatch(
          customerFeedbackActions.setContactInfo({ contactInfo })
        );
      }
    });

    // Fetch responses and contact info and submit them
    this.store
      .select(customerFeedbackSelectors.getSurveyResponses)
      .pipe(
        switchMap((responses) =>
          this.store.select(customerFeedbackSelectors.getContactInfo).pipe(
            filter((contactInfo) => contactInfo !== null), // Ensure contactInfo is not null
            take(1),
            map((contactInfo) => ({ response: responses, contactInfo })) // Correct property name
          )
        ),
        take(1)
      )
      .subscribe(({ response, contactInfo }) => {
        // Ensure that contactInfo is not null when dispatching
        if (contactInfo) {
          this.store.dispatch(
            customerFeedbackActions.submitSurveyResponses({
              contactInfo,
              response, // Ensure this matches the action's expected parameter
            })
          );

          this.isSurveyCompleted = true;
          this.currentQuestionIndex++;
        } else {
          // Optionally handle the error state if contact info is missing
          console.error('Contact information is missing.');
        }
      });
  }

  handleAnswerSelected(response: FeedbackResponse) {
    this.store.dispatch(
      customerFeedbackActions.addSurveyResponse({ response })
    );
  }
}
