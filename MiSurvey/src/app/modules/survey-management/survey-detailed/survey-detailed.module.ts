import { SurveyDetailedRoutingModule } from './survey-detailed-routing.module';
import { SurveyDetailedComponent } from './survey-detailed.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from './../../../shared/share.module';
import { FormsModule } from '@angular/forms';
import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  DropdownModule,
  FormModule,
  ModalModule,
  ProgressModule,
  TableModule,
  CardModule,
  GridModule,
  NavModule,
  UtilitiesModule,
  TabsModule,
} from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';
@NgModule({
  declarations: [
    SurveyDetailedComponent
  ],
  imports: [
    CommonModule,
    SurveyDetailedRoutingModule,
    ShareModule,
    AvatarModule,
    ButtonGroupModule,
    ButtonModule,
    DropdownModule,
    FormModule,
    ModalModule,
    ProgressModule,
    TableModule,
    CardModule,
    GridModule,
    NavModule,
    UtilitiesModule,
    TabsModule,
    FormsModule
  ]
})
export class SurveyDetailedModule { }