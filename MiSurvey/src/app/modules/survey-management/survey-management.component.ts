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

  constructor(
    private router: Router,
    private store: Store,
    private surveyManagementService: SurveyManagementService,
    private modalService: ModalService
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
    this.router.navigate(['/survey-management/survey'], { queryParams: { id: surveyId } });
  }

  OpenDeleteSurvey(surveyId: number) {
    this.surveyIDToDelete = surveyId;
    this.modalService.toggle({ show: true, id: 'deleteSurveyModal' });
  }

  deleteSurvey() {
    console.log(this.surveyIDToDelete)
    if(this.surveyIDToDelete) {

      this.store.dispatch(surveyManagementActions.deleteSurveyRequest({ surveyId: this.surveyIDToDelete }));
      this.modalService.toggle({ show: false, id: 'deleteSurveyModal' });
    }
  }

  approveSurvey(surveyId: number, approve: boolean) {
    const updateData = { Approve: approve ? 'Yes' : 'No' };
    this.surveyManagementService.updateSurvey(surveyId, updateData).subscribe({
      next: (response) => {
        console.log('Survey updated successfully:', response);
        alert(`Survey has been ${approve ? 'approved' : 'unapproved'}.`);
      },
      error: (error) => {
        console.error('Error updating survey:', error);
        alert('Failed to update survey status.');
      }
    });
  }

  toggleSurveyStatus(surveyId: number, isOpen: boolean) {
    const updateData = { SurveyStatus: isOpen ? 'Open' : 'Close' };
    this.surveyManagementService.updateSurvey(surveyId, updateData).subscribe({
      next: (response) => {
        console.log('Survey status updated successfully:', response);
        alert(`Survey has been ${isOpen ? 'opened' : 'closed'}.`);
      },
      error: (error) => {
        console.error('Error updating survey status:', error);
        alert('Failed to toggle survey status.');
      }
    });
  }
}
