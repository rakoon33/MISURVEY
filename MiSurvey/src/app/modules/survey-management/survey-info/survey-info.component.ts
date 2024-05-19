import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { surveyManagementActions } from 'src/app/core/store/actions';
import { surveyManagementSelector } from 'src/app/core/store/selectors';
import { SurveyManagementService, ShareImageService } from 'src/app/core/services';
import { catchError } from 'rxjs/operators';
@Component({
  selector: 'app-survey-info',
  templateUrl: './survey-info.component.html',
  styleUrls: ['./survey-info.component.scss'],
})
export class SurveyInfoComponent {
  constructor(
    private router: Router,
    private store: Store,
    private route: ActivatedRoute,
    private surveyManagementService: SurveyManagementService,
    private shareImageService: ShareImageService
  ) {}

  editMode = false;
  surveyId: number | undefined;

  surveyTitle: string = 'Your survey title';
  topBarColor: string = '#BA3232';
  buttonTextColor: string = '#2f3c54';
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  surveyDescription: string = '';
  selectedSurveyType: string = 'nps';

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.surveyId = queryParams['id'];
      if (this.surveyId) {
        this.editMode = true;
        console.log(this.surveyId);
        this.loadSurveyDetails(this.surveyId);
      } else {
        console.log('Survey ID is undefined');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.selectedImage = reader.result;
        this.shareImageService.setFile(this.selectedFile);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  loadSurveyDetails(id: number) {
    this.store.dispatch(
      surveyManagementActions.loadSurveyDetailRequest({ id })
    );
    this.store
      .select(surveyManagementSelector.selectCurrentSurvey)
      .subscribe((survey) => {
        if (survey) {
          console.log(survey);
          this.surveyTitle = survey.Title ?? 'Your survey title';
          this.topBarColor = survey.Customizations?.topBarColor ?? '#BA3232';
          this.buttonTextColor =
            survey.Customizations?.buttonTextColor ?? '#2f3c54';
          this.surveyDescription = survey.SurveyDescription ?? 'No description';
        }
      });
  }

  nextToQuestion(): void {
    if (this.editMode) {
      // Cập nhật thông tin survey
      if (this.surveyId) {
        this.store.dispatch(
          surveyManagementActions.updateSurveyRequest({
            surveyId: this.surveyId,
            surveyData: {
              Title: this.surveyTitle,
              Customizations: {
                topBarColor: this.topBarColor,
                buttonTextColor: this.buttonTextColor,
              },
              SurveyDescription: this.surveyDescription,
            },
          })
        );
        this.surveyManagementService
          .uploadImage(this.surveyId!, this.selectedFile!)
          .pipe(
            catchError((error) => {
              console.error('Upload failed', error);
              throw error;
            })
          )
          .subscribe((event) => {
            console.log('Upload success', event);
          });

        this.router.navigate(['/survey-management']);
      }
    } else {
      // Tạo mới survey
      this.store.dispatch(
        surveyManagementActions.cacheSurveyInfo({
          title: this.surveyTitle,
          customizations: {
            topBarColor: this.topBarColor,
            buttonTextColor: this.buttonTextColor,
          },
          surveyDescription: this.surveyDescription,
        })
      );
      this.router.navigate(['/survey-management/question']);
    }
  }
}
