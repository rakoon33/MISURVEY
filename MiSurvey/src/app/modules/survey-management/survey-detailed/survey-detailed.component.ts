import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SurveyQuestion } from 'src/app/core/models';
import { surveyManagementActions } from 'src/app/core/store/actions';
import { surveyManagementSelector } from 'src/app/core/store/selectors';
import { MatDialog } from '@angular/material/dialog';
import { EmailModalComponent } from 'src/app/shared/components/email-modal/email-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { SurveyManagementService } from './../../../core/services/survey-management.service';
@Component({
  selector: 'app-survey-detailed',
  templateUrl: './survey-detailed.component.html',
  styleUrls: ['./survey-detailed.component.scss'],
})
export class SurveyDetailedComponent implements OnInit {
  survey: any;
  questionIDToDelete: number = 0;

  public thankYouMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private surveyManagementService: SurveyManagementService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.store.dispatch(
          surveyManagementActions.loadSurveyDetailRequest({ id })
        );
      }
    });

    this.store
      .select(surveyManagementSelector.selectSurveyValue)
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
        return 'stars';
    }
  }

  moveQuestionUp(question: SurveyQuestion) {
    this.updateQuestionOrder(question, -1);
  }

  moveQuestionDown(question: SurveyQuestion) {
    this.updateQuestionOrder(question, 1);
  }

  private updateQuestionOrder(question: SurveyQuestion, direction: number) {
    const questions = [...this.survey.SurveyQuestions]; // Create a shallow copy of the questions array
    const index = questions.findIndex(
      (q) => q.QuestionID === question.QuestionID
    );

    if (
      (direction === -1 && index > 0) ||
      (direction === 1 && index < questions.length - 1)
    ) {
      // Create copies of the questions to be swapped
      const question1 = { ...questions[index] };
      const question2 = { ...questions[index + direction] };

      // Swap the PageOrder values
      [question1.PageOrder, question2.PageOrder] = [
        question2.PageOrder,
        question1.PageOrder,
      ];

      // Replace the questions in the array with their updated copies
      questions[index] = question1;
      questions[index + direction] = question2;

      // Sort the questions again based on the updated PageOrder
      questions.sort(
        (a, b) =>
          (a.PageOrder || Number.MAX_SAFE_INTEGER) -
          (b.PageOrder || Number.MAX_SAFE_INTEGER)
      );

      // Update the local survey object with the new questions array
      this.survey = {
        ...this.survey,
        SurveyQuestions: questions,
      };

      console.log(this.survey);

      this.store.dispatch(
        surveyManagementActions.updateSurveyRequest({
          surveyId: this.survey.SurveyID,
          surveyData: this.survey,
        })
      );
    }
  }

  editQuestion(question: SurveyQuestion) {
    this.router.navigate(['/survey-management/question/configure'], {
      queryParams: { edit: true, question: JSON.stringify(question) },
    });
  }

  openDeleteQuestionModal(questionId: number) {
    this.questionIDToDelete = questionId;
    this.modalService.toggle({ show: true, id: 'deleteQuestionModal' });
  }

  deleteQuestion() {
    // Call backend service to delete the question
    this.surveyManagementService
      .deleteSurveyQuestion(this.questionIDToDelete)
      .subscribe(
        (response) => {
          if (response.status) {
            // Remove the question from the local survey data
            const questions = this.survey.SurveyQuestions.filter(
              (q: { QuestionID: number }) =>
                q.QuestionID !== this.questionIDToDelete
            );

            // Optionally re-index the remaining questions for PageOrder
            questions.forEach((q: { PageOrder: any }, i: number) => {
              q.PageOrder = i + 1;
            });

            // Update the local survey object with the updated questions array
            this.survey = {
              ...this.survey,
              SurveyQuestions: questions,
            };

            // Dispatch an action to update the store
            this.store.dispatch(
              surveyManagementActions.updateSurveyRequest({
                surveyId: this.survey.SurveyID,
                surveyData: this.survey,
              })
            );

            // Display success message
            this.toastrService.success('Question deleted successfully');
            this.modalService.toggle({
              show: false,
              id: 'deleteQuestionModal',
            });
          } else {
            // Handle error response from backend
            this.toastrService.error(
              response.message || 'Failed to delete question'
            );
          }
        },
        (error) => {
          // Handle any network errors
          this.toastrService.error(
            'An error occurred while deleting the question'
          );
        }
      );
  }

  addNewQuestion() {
    this.router.navigate(['/survey-management/question'], {
      queryParams: { add: true, surveyId: this.survey.SurveyID },
    });
  }

  editThankMessage() {
    this.thankYouMessage = this.survey?.ThankYouMessage || '';
    this.modalService.toggle({ show: true, id: 'editThankMessageModal' });
  }

  saveThankMessage() {
    // Create an updated Customizations object by merging the existing properties
    const updatedCustomizations = {
      ...this.survey.Customizations, // Include existing properties
      topBarColor: this.survey.Customizations.topBarColor, // Preserve topBarColor
      buttonTextColor: this.survey.Customizations.buttonTextColor, // Preserve buttonTextColor
      thankMessage: this.thankYouMessage // Add the updated thankMessage
    };
  
    // Update the survey object with the modified Customizations object
    this.survey = {
      ...this.survey,
      Customizations: updatedCustomizations
    };
  
    // Optionally: Call the backend to save the updated survey
    this.store.dispatch(
      surveyManagementActions.updateSurveyRequest({
        surveyId: this.survey.SurveyID,
        surveyData: this.survey
      })
    );
  
    // Close the modal
    this.modalService.toggle({ show: false, id: 'editThankMessageModal' });
  }
  
  openEmailModal() {
    const currentSurveyId = this.survey?.SurveyID;
    if (currentSurveyId) {
      const dialogRef = this.dialog.open(EmailModalComponent, {
        width: '700px',
        data: { surveyId: currentSurveyId },
      });

      dialogRef.afterClosed().subscribe((result) => {
        // Kiểm tra nếu result có thuộc tính status
        if (result?.status) {
          this.toastrService.success(result.message);
        } else if (result) {
          this.toastrService.error(result.message);
        }
      });
    }
  }
}
