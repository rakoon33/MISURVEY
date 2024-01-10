import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionConfigureComponent } from './question-configure.component';
import { QuestionConfigureRoutingModule } from './question-configure-routing.module';
import { IconModule } from '@coreui/icons-angular';
@NgModule({
  declarations: [
    QuestionConfigureComponent
  ],
  imports: [
    CommonModule,
    QuestionConfigureRoutingModule,
    IconModule
  ]
})
export class QuestionConfigureModule { }