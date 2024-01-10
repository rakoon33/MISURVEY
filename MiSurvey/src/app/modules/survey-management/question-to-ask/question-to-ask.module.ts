import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionToAskRoutingModule } from './question-to-ask-routing.module';
import { QuestionToAskComponent } from './question-to-ask.component';
import { FormsModule } from '@angular/forms'; // Đảm bảo rằng đã nhập module này

@NgModule({
  declarations: [
    QuestionToAskComponent
  ],
  imports: [
    CommonModule,
    QuestionToAskRoutingModule,
    FormsModule
  ]
})
export class QuestionToAskModule { }