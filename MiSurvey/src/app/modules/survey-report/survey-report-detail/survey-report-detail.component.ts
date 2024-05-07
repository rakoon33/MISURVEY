import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/core/services/report.service';

type QuestionType = 'NPS' | 'CSAT' | 'Stars' | 'Thumbs' | 'Emoticons' | 'Text';
@Component({
  selector: 'app-survey-report-detail',
  templateUrl: './survey-report-detail.component.html',
  styleUrls: ['./survey-report-detail.component.scss'],
})
export class SurveyReportDetailComponent implements OnInit {
  surveyQuestionData: any[] = []; // Store survey questions data
  chartSurveyData: any[] = []; // Data for charts
  private isDataLoaded = false;
  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const surveyId = this.route.snapshot.params['surveyId'];
    this.loadSurveyQuestionData(surveyId);
  }

  loadSurveyQuestionData(surveyId: number) {
    this.reportService.getSurveyQuestionData(surveyId).subscribe((response) => {
      if (response.status && response.data) {
        this.surveyQuestionData = response.data.surveyQuestions || [];
        this.chartSurveyData = this.surveyQuestionData
          .map((question) => {
            return {
              questionText: question.questionText,
              questionType: question.questionType,
              responseRate: question.responseRate,
              labels: this.getLabels(question),
              type: this.getChartType(question.questionType as QuestionType),
              data: this.getChartData(question),
              backgroundColor: this.getBackgroundColor(
                question.questionType as QuestionType
              ),
              borderColor: this.getBorderColor(
                question.questionType as QuestionType
              ),
              label: this.getChartLabel(question.questionType as QuestionType),
              additionalData: question.data, // Include additional data
            };
          })
          .filter((chart) => chart !== null);
        this.isDataLoaded = true;
      } else {
        console.error('Invalid response:', response);
      }
    }, (error) => {
      console.error('Error fetching survey data:', error);
    });
  }
  
  

  // Create a helper method to extract chart labels
  private getLabels(question: any): string[] {
    switch (question.questionType) {
      case 'NPS':
        return Array.from({ length: 10 }, (_, i) => `${i + 1}`);
      case 'CSAT':
        return Array.from({ length: 5 }, (_, i) => `${i + 1}`);
      case 'Stars':
        return Array.from({ length: 5 }, (_, i) => `${i + 1}`);
      case 'Thumbs':
        return ['Thumbs Up', 'Thumbs Down'];
      case 'Emoticons':
        return ['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good'];
      default:
        return question.data.options || [];
    }
  }
  getChartType(questionType: QuestionType) {
    console.log(' getChartType 3');
    if (questionType === 'Emoticons') return 'doughnut';
    else if (questionType === 'Thumbs') return 'pie';
    return 'bar'; // Default chart type
  }

  getChartData(question: any) {
    switch (question.questionType) {
      case 'NPS':
        return Object.values(question.data.countByValue);
      case 'CSAT':
        return Object.values(question.data.countByValue);
      case 'Stars':
        return Object.values(question.data.countByValue);
      case 'Thumbs':
        return [question.data.thumbsUp, question.data.thumbsDown];
      case 'Emoticons':
        return [
          question.data.veryBad,
          question.data.bad,
          question.data.neutral,
          question.data.good,
          question.data.veryGood,
        ];
      case 'Text':
        return question.data.responses.map((_: any) => 1);
      default:
        return [];
    }
  }

  getBackgroundColor(questionType: QuestionType) {
    console.log(' getBackgroundColor 6');
    const colors: { [key in QuestionType]: string | string[] } = {
      NPS: [
        'rgba(255, 99, 132, 0.2)', // Detractors (1)
        'rgba(255, 99, 132, 0.2)', // Detractors (2)
        'rgba(255, 99, 132, 0.2)', // Detractors (3)
        'rgba(255, 99, 132, 0.2)', // Detractors (4)
        'rgba(255, 99, 132, 0.2)', // Detractors (5)
        'rgba(255, 99, 132, 0.2)', // Detractors (6)
        'rgba(255, 206, 86, 0.2)', // Passives (7)
        'rgba(255, 206, 86, 0.2)', // Passives (8)
        'rgba(75, 192, 192, 0.2)', // Promoters (9)
        'rgba(75, 192, 192, 0.2)', // Promoters (10)
      ],
      CSAT: [
        'rgba(255, 99, 132, 0.2)', // Very Dissatisfied (1)
        'rgba(255, 99, 132, 0.2)', // Very Dissatisfied (2)
        'rgba(255, 206, 86, 0.2)', // Neutral (3)
        'rgba(75, 192, 192, 0.2)', // Satisfied (4)
        'rgba(75, 192, 192, 0.2)', // Satisfied (5)
      ],
      Stars: [
        'rgba(255, 99, 132, 0.2)', // Very Dissatisfied (1)
        'rgba(255, 99, 132, 0.2)', // Very Dissatisfied (2)
        'rgba(255, 206, 86, 0.2)', // Neutral (3)
        'rgba(75, 192, 192, 0.2)', // Satisfied (4)
        'rgba(75, 192, 192, 0.2)', // Satisfied (5)
      ],
      Thumbs: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
      Emoticons: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      Text: 'rgba(255, 206, 86, 0.2)',
    };
    return colors[questionType];
  }

  getBorderColor(questionType: QuestionType) {
    const colors: { [key in QuestionType]: string | string[] } = {
      NPS: [
        'rgba(255, 99, 132, 1)', // Detractors (1-6)
        'rgba(255, 206, 86, 1)', // Passives (7-8)
        'rgba(75, 192, 192, 1)', // Promoters (9-10)
      ],
      CSAT: [
        'rgba(255, 99, 132, 1)', // Very Dissatisfied (1-2)
        'rgba(255, 206, 86, 1)', // Neutral (3)
        'rgba(75, 192, 192, 1)', // Satisfied (4-5)
      ],
      Stars: 'rgba(153, 102, 255, 1)',
      Thumbs: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
      Emoticons: [
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      Text: 'rgba(255, 206, 86, 1)',
    };
    return colors[questionType];
  }

  getChartLabel(questionType: QuestionType) {
    switch (questionType) {
      case 'NPS':
        return 'NPS Value Count';
      case 'CSAT':
        return 'CSAT Value Count';
      case 'Stars':
        return 'Stars Value Count';
      default:
        return ''; // Mặc định trả về rỗng nếu không khớp
    }
  }
}
