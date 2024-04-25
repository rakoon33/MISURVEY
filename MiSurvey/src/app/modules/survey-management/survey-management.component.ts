import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { surveyManagementActions } from 'src/app/core/store/actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { surveyManagementSelector } from 'src/app/core/store/selectors';
import { SurveyManagementService } from 'src/app/core/services';
import { ModalService } from '@coreui/angular';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-survey-management',
  templateUrl: './survey-management.component.html',
  styleUrls: ['./survey-management.component.scss'],
  providers: [DatePipe],
})
export class SurveyManagementComponent implements OnInit {
  surveys$: Observable<any[]>;

  selectedSurveySummary: any[] = [];
  selectedSurveyQuestion: any = {};
  currentQuestionIndex: number = 0;
  surveyIDToDelete: number | undefined;

  qrVisible: boolean = false;

  constructor(
    private router: Router,
    private store: Store,
    private surveyManagementService: SurveyManagementService,
    private modalService: ModalService,
    private toastr: ToastrService
  ) {
    this.surveys$ = this.store.select(
      surveyManagementSelector.selectAllSurveys
    );
  }

  ngOnInit(): void {
    this.store.dispatch(surveyManagementActions.fetchSurveysRequest());
  }

  copySurveyLink(link: string, event: MouseEvent) {
    event.preventDefault();
    link = 'http://localhost:8082/#/c/f/' + link;
    navigator.clipboard.writeText(link).then(
      () => {
        console.log('Link copied to clipboard!');
      },
      (err) => {
        console.error('Error copying link: ', err);
      }
    );
  }

  navigateToCreateSurvey() {
    this.store.dispatch(surveyManagementActions.resetSurveyState());
    this.router.navigate(['/survey-management/survey-method']);
  }

  navigateToSurveyDetails(surveyId: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/survey-management/survey-detailed', surveyId]);
  }

  openModal(surveyId: number) {
    this.surveyManagementService.getSurveySummaryById(surveyId).subscribe({
      next: (response) => {
        if (response && response.status) {
          this.selectedSurveySummary = response.summary;
          this.currentQuestionIndex = 0;
          console.log(this.selectedSurveySummary);
          this.showCurrentQuestion();
        }
      },
      error: (error) => console.error('Error fetching survey summary:', error),
    });
  }

  showCurrentQuestion() {
    this.selectedSurveyQuestion =
      this.selectedSurveySummary[this.currentQuestionIndex];
    console.log(this.selectedSurveyQuestion);
    console.log(this.currentQuestionIndex);
    this.toggleModal('seeResponsesModal', true);
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.selectedSurveySummary.length - 1) {
      this.currentQuestionIndex++;
      this.showCurrentQuestion();
    } else {
      this.toggleModal('seeResponsesModal', false);
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.showCurrentQuestion();
    }
  }
  toggleModal(modalId: string, show: boolean) {
    this.modalService.toggle({ id: modalId, show: show });
  }
  isValidEmail(email: string): boolean {
    return new FormControl(email, Validators.email).valid;
  }

  editSurvey(surveyId: number) {
    this.router.navigate(['/survey-management/survey'], {
      queryParams: { id: surveyId },
    });
  }

  openDeleteSurvey(surveyId: number) {
    this.surveyIDToDelete = surveyId;
    this.modalService.toggle({ show: true, id: 'deleteSurveyModal' });
  }

  deleteSurvey() {
    console.log(this.surveyIDToDelete);
    if (this.surveyIDToDelete) {
      this.store.dispatch(
        surveyManagementActions.deleteSurveyRequest({
          surveyId: this.surveyIDToDelete,
        })
      );
      this.modalService.toggle({ show: false, id: 'deleteSurveyModal' });
    }
  }

  toggleApproval(surveyId: number, surveyApproval: string) {
    this.surveyManagementService.getSurveyById(surveyId).subscribe({
      next: (response) => {
        if (response.status) {
          response.survey.Approve =
            surveyApproval === 'Yes' ? 'Pending' : 'Yes';
          this.updateSurvey(surveyId, response.survey);
        }
      },
      error: (error) => this.toastr.error('Failed to fetch survey', error),
    });
  }

  toggleStatus(surveyId: number, surveyApproval: string) {
    this.surveyManagementService.getSurveyById(surveyId).subscribe({
      next: (response) => {
        if (response.status) {
          response.survey.SurveyStatus =
            surveyApproval === 'Open' ? 'Closed' : 'Open';
          this.updateSurvey(surveyId, response.survey);
        }
      },
      error: (error) => this.toastr.error('Failed to fetch survey', error),
    });
  }

  updateSurvey(surveyId: number, updateData: any) {
    this.surveyManagementService.updateSurvey(surveyId, updateData).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success('Survey updated successfully:');
          this.store.dispatch(surveyManagementActions.fetchSurveysRequest());
        }
      },
      error: (error) => this.toastr.error('Error updating survey', error),
    });
  }
}
