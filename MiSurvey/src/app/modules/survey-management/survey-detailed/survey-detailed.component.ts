import { SurveyManagementService } from './../../../core/services/survey-management.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SurveyQuestion } from 'src/app/core/models';
import { surveyManagementActions } from 'src/app/core/store/actions';
import { surveyManagementSelector } from 'src/app/core/store/selectors';
import { MatDialog } from '@angular/material/dialog';
import { EmailModalComponent } from 'src/app/shared/components/email-modal/email-modal.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-survey-detailed',
  templateUrl: './survey-detailed.component.html',
  styleUrls: ['./survey-detailed.component.scss'],
})
export class SurveyDetailedComponent implements OnInit {
  survey: any;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
    private toastrService: ToastrService
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

    console.log(this.survey);
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

  deleteQuestion() {
    // Logic để xoá câu hỏi
  }

  addNewQuestion() {
    this.router.navigate(['/survey-management/question'], {
      queryParams: { add: true, surveyId: this.survey.SurveyID },
    });
  }

  editThankMessage() {}

  addThankYouMessage() {
    // Logic để xoá câu hỏi
  }

  openEmailModal() {
    const currentSurveyId = this.survey?.SurveyID;
    this.toastrService.success('hhhh');
    if (currentSurveyId) {
      const dialogRef = this.dialog.open(EmailModalComponent, {
        width: '700px',
        data: { surveyId: currentSurveyId } 
      });
  
      dialogRef.afterClosed().subscribe(result => {
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
