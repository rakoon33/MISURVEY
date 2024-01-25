import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionConfigureComponent } from './question-configure.component';
import { QuestionConfigureRoutingModule } from './question-configure-routing.module';
import { IconModule } from '@coreui/icons-angular';

import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    QuestionConfigureComponent
  ],
  imports: [
    CommonModule,
    QuestionConfigureRoutingModule,
    IconModule,
    FormsModule
  ]
})
export class QuestionConfigureModule { }