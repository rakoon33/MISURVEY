import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReportService } from 'src/app/core/services/report.service';
import { userSelector } from 'src/app/core/store/selectors';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe],
})
export class DashboardComponent {
  userCount: number = 0;
  companyCount: number = 0;
  surveyCount: number = 0;
  companyRoleCount: number = 0;
  customerCount: number = 0;
  currentUser: any;

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  activityStartDate: string;
  activityEndDate: string = new Date().toISOString(); // Today
  surveyTypeStartDate: string;
  surveyTypeEndDate: string = new Date().toISOString(); // Today
  surveyCountStartDate: string;
  surveyCountEndDate: string = new Date().toISOString(); // Today

  chartActivityData:
    | {
        labels: any;
        datasets: {
          label: string;
          data: any;
          backgroundColor: string;
          borderColor: string;
        }[];
      }
    | undefined;
  surveyTypeUsageData:
    | {
        labels: any;
        datasets: {
          label: string;
          data: any;
          backgroundColor: string;
          borderColor: string;
        }[];
      }
    | undefined;
  surveyCountData:
    | {
        labels: any;
        datasets: {
          label: string;
          data: any;
          backgroundColor: string;
          borderColor: string;
        }[];
      }
    | undefined;

  constructor(
    private reportService: ReportService,
    private store: Store,
    private datePipe: DatePipe
  ) {
    const today = new Date();
    const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
    this.surveyTypeStartDate = this.formatDate(sevenDaysAgo);
    this.surveyCountStartDate = this.formatDate(sevenDaysAgo);
    this.activityStartDate = this.formatDate(sevenDaysAgo); 

    this.activityEndDate = this.formatDate(new Date());
    this.surveyCountEndDate = this.formatDate(new Date());
    this.surveyTypeEndDate = this.formatDate(new Date());

    this.loadDashboardData();
    this.loadActivityOverviewData();
    this.loadSurveyTypeUsageData();
    this.loadSurveyCountByDateRangeData();
  }

  ngOnInit(): void {
    this.store
      .select(userSelector.selectCurrentUser)
      .subscribe((user) => (this.currentUser = user));

    this.loadDashboardData();
  }

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  loadDashboardData(): void {
    this.reportService.getDashboardData().subscribe((response) => {
      if (this.currentUser.UserRole == 'SuperAdmin') {
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

  loadActivityOverviewData(): void {
    this.reportService
      .getActivityOverview(this.activityStartDate, this.activityEndDate)
      .subscribe((response) => {
        // Process response and assign data to chart
        this.chartActivityData = {
          labels: response.data.newUserCountByDate.map(
            (item: { date: any }) => item.date
          ),
          datasets: [
            {
              label: 'User Growth',
              data: response.data.newUserCountByDate.map(
                (item: { count: any }) => item.count
              ),
              backgroundColor: 'rgba(0, 123, 255, 0.5)', // Example color
              borderColor: 'rgba(0, 123, 255, 1)', // Example border color
            },
          ],
        };
      });
  }

  loadSurveyTypeUsageData(): void {
    this.reportService
      .getSurveyTypeUsage(this.surveyTypeStartDate, this.surveyTypeEndDate)
      .subscribe((response) => {
        this.surveyTypeUsageData = {
          labels: response.data.map(
            (item: { SurveyTypeName: any }) => item.SurveyTypeName
          ),
          datasets: [
            {
              label: 'Survey Type Usage',
              data: response.data.map(
                (item: { QuestionCount: any }) => item.QuestionCount
              ),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
            },
          ],
        };
      });
  }

  loadSurveyCountByDateRangeData(): void {
    this.reportService
      .getSurveyCountByDateRange(
        this.surveyCountStartDate,
        this.surveyCountEndDate
      )
      .subscribe((response) => {
        this.surveyCountData = {
          labels: response.data.map((item: { date: any }) => item.date),
          datasets: [
            {
              label: 'Survey Count',
              data: response.data.map((item: { count: any }) => item.count),
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
            },
          ],
        };
      });
  }

  get randomData() {
    return Math.round(Math.random() * 100);
  }
}
