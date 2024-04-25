import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReportService } from 'src/app/core/services';
import { userSelector } from 'src/app/core/store/selectors';
@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userCount: number | string = 0;
  companyCount: number | string = 0;
  surveyCount: number | string = 0;
  companyRoleCount: number | string = 0;
  customerCount: number | string = 0;
  isSuperAdmin: boolean = false; 
  currentUser: any;

  constructor(
    private reportService: ReportService,
    private store: Store,
  ) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7); // One week ago
  }

  ngOnInit(): void {
    this.store
    .select(userSelector.selectCurrentUser)
    .subscribe((user) => (this.currentUser = user));
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.reportService.getDashboardData().subscribe(response => {

      if(this.currentUser.UserRole == 'SuperAdmin') {
        this.userCount = response.userCount;
        this.companyCount = response.companyCount;
        this.surveyCount = response.surveyCount;
      } else {
        this.userCount = response.userCount;
        this.surveyCount = response.surveyCount;
        this.companyRoleCount = response.companyRoleCount;
        this.customerCount = response.customerCount;
      }
     
    });
  }
}
