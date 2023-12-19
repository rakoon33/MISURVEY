import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LottieModule } from 'ngx-lottie';
import { SurveySelectorComponent } from './components/survey-selector/survey-selector.component';
import { NpsSurveyComponent } from './components/survey-selector/nps-survey/nps-survey.component';
import { CsatSurveyComponent } from './components/survey-selector/csat-survey/csat-survey.component';
import { StarRatingComponent } from './components/survey-selector/star-rating/star-rating.component';
import { ThumbsSurveyComponent } from './components/survey-selector/thumbs-survey/thumbs-survey.component';
import { EmoticonRatingComponent } from './components/survey-selector/emoticon-rating/emoticon-rating.component';
import { IconModule } from '@coreui/icons-angular';
@NgModule({
  declarations: [
    CustomInputComponent,
    LoadingComponent,
    SurveySelectorComponent,
    NpsSurveyComponent,
    CsatSurveyComponent,
    StarRatingComponent,
    ThumbsSurveyComponent,
    EmoticonRatingComponent  
  ],
  imports: [
    CommonModule,
    FormsModule,
    LottieModule,
    IconModule
  ],
  exports: [
    CustomInputComponent,
    LoadingComponent,
    SurveySelectorComponent
  ]
})
export class ShareModule { }
