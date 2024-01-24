import { SurveyManagementService } from './../../../core/services/survey-management.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { surveyManagementActions } from 'src/app/core/store/actions';
import { surveyManagementSelector } from 'src/app/core/store/selectors';
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
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id']; // '+' chuyển đổi string sang number
      if (id) {
        this.store.dispatch(surveyManagementActions.loadSurveyDetailRequest({ id }));
      }
    });

    // Theo dõi state để cập nhật dữ liệu khi có thay đổi
    this.store.select(surveyManagementSelector.selectSurveyValue).subscribe(survey => {
      this.survey = survey;
      console.log(survey);
    });
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

  moveQuestionUp() {
    // Logic để di chuyển câu hỏi lên
  }

  moveQuestionDown() {
    // Logic để di chuyển câu hỏi xuống
  }

  editQuestion() {
    // Logic để mở form chỉnh sửa câu hỏi
  }

  deleteQuestion() {
    // Logic để xoá câu hỏi
  }

  addNewQuestion() {
    this.router.navigate(['/survey-management/question']);
  }


  addThankYouMessage() {
    // Logic để xoá câu hỏi
  }

}
