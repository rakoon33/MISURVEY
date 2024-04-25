import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReportService } from 'src/app/core/services/report.service';
import { userSelector } from 'src/app/core/store/selectors';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent {


  userCount: number = 0;
  companyCount: number = 0;
  surveyCount: number = 0;
  companyRoleCount: number = 0;
  customerCount: number = 0;
  currentUser: any;

  chartBarData2: {
    labels: any; datasets: {
      label: string; data: any; backgroundColor: string; 
      borderColor: string;
    }[];
  } | undefined;
  surveyTypeUsageData: { labels: any; datasets: { label: string; data: any; backgroundColor: string; borderColor: string; }[]; } | undefined;
  surveyCountData: { labels: any; datasets: { label: string; data: any; backgroundColor: string; borderColor: string; }[]; } | undefined;

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  chartBarData = {
    labels: [...this.months].slice(0, 7),
    datasets: [
      {
        label: 'GitHub Commits',
        backgroundColor: '#f87979',
        data: [40, 20, 12, 39, 17, 42, 79]
      }
    ]
  };

  // chartBarOptions = {
  //   maintainAspectRatio: false,
  // };

  chartLineData = {
    labels: [...this.months].slice(0, 7),
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: [this.randomData, this.randomData, this.randomData, this.randomData, this.randomData, this.randomData, this.randomData]
      },
      {
        label: 'My Second dataset',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: [this.randomData, this.randomData, this.randomData, this.randomData, this.randomData, this.randomData, this.randomData]
      }
    ]
  };

  chartLineOptions = {
    maintainAspectRatio: false,
  };

  chartDoughnutData = {
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'Angular'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: [40, 20, 80, 10]
      }
    ]
  };

  // chartDoughnutOptions = {
  //   aspectRatio: 1,
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   radius: '100%'
  // };

  chartPieData = {
    labels: ['Red', 'Green', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  // chartPieOptions = {
  //   aspectRatio: 1,
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   radius: '100%'
  // };

  chartPolarAreaData = {
    labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
    datasets: [
      {
        data: [11, 16, 7, 3, 14],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB']
      }
    ]
  };

  chartRadarData = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [
      {
        label: '2020',
        backgroundColor: 'rgba(179,181,198,0.2)',
        borderColor: 'rgba(179,181,198,1)',
        pointBackgroundColor: 'rgba(179,181,198,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(179,181,198,1)',
        tooltipLabelColor: 'rgba(179,181,198,1)',
        data: [65, 59, 90, 81, 56, 55, 40]
      },
      {
        label: '2021',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        pointBackgroundColor: 'rgba(255,99,132,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255,99,132,1)',
        tooltipLabelColor: 'rgba(255,99,132,1)',
        data: [this.randomData, this.randomData, this.randomData, this.randomData, this.randomData, this.randomData, this.randomData]
      }
    ]
  };

  // chartRadarOptions = {
  //   aspectRatio: 1.5,
  //   responsive: true,
  //   maintainAspectRatio: false,
  // };

  get randomData() {
    return Math.round(Math.random() * 100);
  }

  constructor(private reportService: ReportService, private store: Store) {
    
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

  loadActivityOverviewData(): void {
    let startDate = new Date();
    let endDate = new Date();
    startDate.setDate(endDate.getDate() - 7); // One week ago
    this.reportService.getActivityOverview(startDate.toISOString(), endDate.toISOString()).subscribe((response) => {
      // Process response and assign data to chart
      this.chartBarData2 = {
        labels: response.data.newUserCountByDate.map((item: { date: any; }) => item.date),
        datasets: [
          {
            label: 'User Growth',
            data: response.data.newUserCountByDate.map((item: { count: any; }) => item.count),
            backgroundColor: 'rgba(0, 123, 255, 0.5)', // Example color
            borderColor: 'rgba(0, 123, 255, 1)', // Example border color
          }
        ]
      };
      console.log(this.chartBarData);
    });
  }

  loadSurveyTypeUsageData(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
  
    this.reportService.getSurveyTypeUsage(startDate.toISOString(), endDate.toISOString())
      .subscribe((response) => {
        this.surveyTypeUsageData = {
          labels: response.data.map((item: { SurveyTypeName: any; }) => item.SurveyTypeName),
          datasets: [{
            label: 'Survey Type Usage',
            data: response.data.map((item: { QuestionCount: any; }) => item.QuestionCount),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
          }]
        };
      });
  }
  
  loadSurveyCountByDateRangeData(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
  
    this.reportService.getSurveyCountByDateRange(startDate.toISOString(), endDate.toISOString())
      .subscribe((response) => {
        this.surveyCountData = {
          labels: response.data.map((item: { date: any; }) => item.date),
          datasets: [{
            label: 'Survey Count',
            data: response.data.map((item: { count: any; }) => item.count),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
          }]
        };
      });
  }
}
