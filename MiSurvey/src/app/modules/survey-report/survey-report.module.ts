import { ReactiveFormsModule } from '@angular/forms';
import { SurveyReportComponent } from './survey-report.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SurveyReportRoutingModule } from './survey-report-routing.module';
import { IconModule } from '@coreui/icons-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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

@NgModule({
  declarations: [SurveyReportComponent],
  imports: [
    CommonModule,
    SurveyReportRoutingModule,
    ReactiveFormsModule,
    IconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
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
  ],
})
export class SurveyReportModule {}
