import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { surveyManagementActions } from '../../core/store/actions';
import { surveyManagementSelector, userSelector } from '../../core/store/selectors';
import { Permission } from '../../core/models';
import { map, take } from 'rxjs/operators';
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
