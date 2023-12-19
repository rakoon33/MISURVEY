import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionConfigureComponent } from './question-configure.component';
import { QuestionConfigureRoutingModule } from './question-configure-routing.module';
@NgModule({
  declarations: [
    QuestionConfigureComponent
  ],
  imports: [
    CommonModule,
    QuestionConfigureRoutingModule
  ]
})
export class QuestionConfigureModule { }