import { Component, OnInit, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { surveyManagementActions } from 'src/app/core/store/actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { surveyManagementSelector, userSelector } from 'src/app/core/store/selectors';
import { SurveyManagementService } from 'src/app/core/services';
import { ModalService } from '@coreui/angular';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Permission } from 'src/app/core/models';
import { Subscription, combineLatest, map, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  qrCodeLink: string | undefined;

  userPermissions$: Observable<Permission | undefined> | undefined;
  qrCodeDownloadLink: SafeUrl | undefined;
  sanitizedSurveyTitle: string = '';
  userPackage$: Observable<any> | undefined;
  
  // search
  filteredSurveys$: Observable<any[]> | undefined;
  currentPage = 1;
  itemsPerPage = 10;
  totalSurveys = 0;
  pages: number[] = [];

  searchText = '';
  searchStatus = '';
  searchApproval = '';

  subscription: Subscription = new Subscription();
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

    this.userPackage$ = this.store.select(userSelector.selectCurrentUserPackages);
    this.userPermissions$ = combineLatest([
      this.store.select(userSelector.selectCurrentUser),
      this.store.select(
        userSelector.selectPermissionByModuleName('Survey Management')
      ),
    ]).pipe(
      map(([currentUser, permissions]) => {
        // If the current user is a Supervisor, return their actual permissions
        if (currentUser?.UserRole === 'Supervisor') {
          return permissions;
        }
        // If not, return an object with all permissions set to true
        return {
          CanView: true,
          CanAdd: true,
          CanUpdate: true,
          CanDelete: true,
          CanExport: true,
          CanViewData: true,
        } as Permission;
      })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(surveyManagementActions.fetchSurveysRequest());
    this.filteredSurveys$ = this.surveys$.pipe(
      tap(surveys => {
        this.totalSurveys = surveys.length;
        this.updatePagination();
      }),
      map(surveys => {
        // Apply your filters here if needed, for example:
        return surveys.filter(survey => {
          return (!this.searchText || survey.Title.toLowerCase().includes(this.searchText.toLowerCase())) &&
                 (!this.searchStatus || survey.SurveyStatus === this.searchStatus) &&
                 (!this.searchApproval || survey.Approve === this.searchApproval);
        }).slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
      })
    );
  }

  copySurveyLink(link: string, event: MouseEvent) {
    event.preventDefault();

    link = `${environment.FRONTEND_BASE_URL}/c/f/` + link;
    navigator.clipboard.writeText(link).then(
      () => {
        console.log('Link copied to clipboard!');
        this.toastr.success('Link copied to clipboard!');
      },
      (err) => {
        console.error('Error copying link: ', err);
        this.toastr.error('Error copying link: ', err);
      }
    );
  }

  applyFilters() {
    this.filteredSurveys$ = this.surveys$.pipe(
      map(surveys => {
        const filtered = surveys.filter(survey =>
          (this.searchText ? survey.Title.toLowerCase().includes(this.searchText.toLowerCase()) : true) &&
          (this.searchStatus ? survey.SurveyStatus === this.searchStatus : true) &&
          (this.searchApproval ? survey.Approve === this.searchApproval : true)
        );
        this.totalSurveys = filtered.length;
        this.updatePagination();
        return filtered;
      })
    );
  }

  updatePagination() {
    const pageCount = Math.ceil(this.totalSurveys / this.itemsPerPage);
    this.pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.pages.length) {
      return;
    }
    this.currentPage = page;
  }

  openQRCodeModal(link: string, title: string, event: Event) {
    event.preventDefault(); 
    this.qrCodeLink = `${environment.FRONTEND_BASE_URL}/c/f/` + link;
    this.sanitizedSurveyTitle = this.sanitizeFileName(title);
    this.modalService.toggle({ id: 'qrCodeModal', show: true });
  }

  sanitizeFileName(title: string): string {
    return title
      .normalize('NFD') // Normalize to decomposed form
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-zA-Z0-9]/g, '_') // Replace non-alphanumeric characters with _
      .toLowerCase(); // Convert to lowercase
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
  
  navigateToCreateSurvey() {
    const subscription = this.userPackage$!.pipe(
      map(userPackage => userPackage.servicePackage?.SurveyLimit || Infinity),
      take(1)  // Ensures that only one item is emitted
    ).subscribe(surveyLimit => {
      this.store.select(surveyManagementSelector.selectAllSurveys).pipe(
        map(surveys => surveys.length),
        take(1)  // Ensures that only one item is emitted
      ).subscribe(surveyCount => {
        if (surveyCount < surveyLimit) {
          this.store.dispatch(surveyManagementActions.resetSurveyState());
          this.router.navigate(['/survey-management/survey-method']);
        } else {
          this.toastr.error(`Your package allows only ${surveyLimit} surveys.`);
        }
        // No need to unsubscribe because `take(1)` completes the observable
      });
    });
  }

  navigateToSurveyDetails(surveyId: number, event: Event, permissions: Permission | undefined): void {
    event.stopPropagation();
    if (permissions?.CanViewData) {
      this.router.navigate(['/survey-management/survey-detailed', surveyId]);
    } else {
      this.toastr.error('You do not have permission to view survey details.');
    }
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
  
  isValidEmail(email: string | undefined): boolean {
    if (!email) {
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
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
    if (this.surveyIDToDelete) {
      this.store.dispatch(
        surveyManagementActions.deleteSurveyRequest({
          surveyId: this.surveyIDToDelete,
        })
      );
      // Dispatch the action to fetch surveys after deletion
      this.store.dispatch(surveyManagementActions.fetchSurveysRequest());
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Unsubscribe from all subscriptions
  }
}
