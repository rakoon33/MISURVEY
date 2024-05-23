import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { surveyManagementActions } from '../../core/store/actions';
import { surveyManagementSelector, userSelector } from '../../core/store/selectors';
import { Permission } from '../../core/models';
import { map, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-survey-report',
  templateUrl: './survey-report.component.html',
  styleUrls: ['./survey-report.component.scss'],
})
export class SurveyReportComponent implements OnInit {
  surveys$: Observable<any[]>;
  userPermissions$: Observable<Permission | undefined> | undefined;

  // search
  filteredSurveys$: Observable<any[]> | undefined;
  currentPage = 1;
  itemsPerPage = 10;
  totalSurveys = 0;
  pages: number[] = [];

  searchText = '';
  searchStatus = '';
  searchApproval = '';

  constructor(
    private store: Store,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.surveys$ = this.store.select(
      surveyManagementSelector.selectAllSurveys
    );

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

  
  navigateToDetail(surveyId: number) {
    this.userPermissions$!.pipe(take(1)).subscribe(permissions => {
      if (permissions?.CanViewData) {
        console.log('Navigating to survey ID:', surveyId);
        this.router.navigate([`/survey-report/survey-report-detail`, surveyId]);
      } else {
        this.toastr.error('Access denied: Cannot view survey details');
      }
    });
  }
}
