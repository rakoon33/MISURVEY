import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { surveyManagementActions } from 'src/app/core/store/actions';

@Component({
  selector: 'app-survey-info',
  templateUrl: './survey-info.component.html',
  styleUrls: ['./survey-info.component.scss'],
})
export class SurveyInfoComponent {
  constructor(
    private router: Router,
    private store: Store
  ) {}

  surveyTitle: string = 'Your survey title';
  topBarColor: string = '#BA3232';
  buttonTextColor: string = '#2f3c54';
  selectedImage: string | ArrayBuffer | null = null;
  surveyDescription: string = '';
  selectedSurveyType: string = 'nps';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.selectedImage = reader.result);
      reader.readAsDataURL(file);
    }
  }

  nextToQuestion(): void {
    this.store.dispatch(surveyManagementActions.cacheSurveyInfo({
      title: this.surveyTitle,
      customizations: {
        topBarColor: this.topBarColor,
        buttonTextColor: this.buttonTextColor
      },
      surveyDescription: this.surveyDescription,
    }));
    this.router.navigate(['/survey-management/question']);
  }
}
