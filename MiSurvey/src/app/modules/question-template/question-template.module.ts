import { ReactiveFormsModule } from '@angular/forms';
import { QuestionTemplateManagementRoutingModule } from './question-template-routing.module';
import { QuestionTemplateManagementComponent } from './question-template.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconModule } from '@coreui/icons-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ShareModule } from 'src/app/shared/share.module';

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
  declarations: [
    QuestionTemplateManagementComponent,
  ],
  imports: [
    CommonModule,
    QuestionTemplateManagementRoutingModule,
    ReactiveFormsModule,
    IconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
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
  
  ]
})
export class QuestionTemplateModule {}
