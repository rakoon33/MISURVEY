import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeedbackResponse } from 'src/app/core/models';

@Component({
  selector: 'app-survey-selector',
  templateUrl: './survey-selector.component.html',
  styleUrls: ['./survey-selector.component.scss']
})
export class SurveySelectorComponent {

  @Input() borderTopColor: string = '#000';
  @Input() title: string = '';
  @Input() question: string = '';
  @Input() selectedSurveyType: string = 'nps';
  @Input() buttonTextColor: string = '#000000';
  @Input() selectedImage: string | ArrayBuffer | null = null; 
  @Input() message: string = '';
  @Input() surveyId: number | undefined;
  @Input() questionId: number | undefined;
  
  @Output() answerSelected = new EventEmitter<FeedbackResponse>();


  handleAnswer(response: FeedbackResponse) {
    this.answerSelected.emit(response);
  }
  
}
