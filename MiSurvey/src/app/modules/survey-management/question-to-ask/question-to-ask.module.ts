import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionToAskRoutingModule } from './question-to-ask-routing.module';
import { QuestionToAskComponent } from './question-to-ask.component';

@NgModule({
  declarations: [
    QuestionToAskComponent
  ],
  imports: [
    CommonModule,
    QuestionToAskRoutingModule
  ]
})
export class QuestionToAskModule { }