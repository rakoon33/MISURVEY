import { SurveyInfoComponent } from './survey-info.component';
import { SurveyInfoRoutingModule } from './survey-info-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    SurveyInfoComponent
  ],
  imports: [
    CommonModule,
    SurveyInfoRoutingModule
  ]
})
export class SurveyInfoModule { }