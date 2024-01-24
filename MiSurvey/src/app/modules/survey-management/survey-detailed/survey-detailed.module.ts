import { SurveyDetailedRoutingModule } from './survey-detailed-routing.module';
import { SurveyDetailedComponent } from './survey-detailed.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from './../../../shared/share.module';


import { IconModule } from '@coreui/icons-angular';
@NgModule({
  declarations: [
    SurveyDetailedComponent
  ],
  imports: [
    CommonModule,
    SurveyDetailedRoutingModule,
    ShareModule
  ]
})
export class SurveyDetailedModule { }