import { Component } from '@angular/core';

@Component({
  selector: 'app-survey-info',
  templateUrl: './survey-info.component.html',
  styleUrls: ['./survey-info.component.scss'],
})
export class SurveyInfoComponent {
  survey = {
    title: '',
    topBarColor: '#ffffff',
    buttonTextColor: '#000000',
    fromEmail: '',
    subject: '',
    question: '',
    rating: null,
  };

  ratingScale = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  addLogo() {
    // Logic to add a logo
  }

  nextStep() {

  }


  setRating(number: number) {}

  submitSurvey() {
    console.log(this.survey);
    // Send the survey data to your server here
  }
}
