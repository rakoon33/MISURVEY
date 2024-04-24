import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionToAskRoutingModule } from './question-to-ask-routing.module';
import { QuestionToAskComponent } from './question-to-ask.component';
import { FormsModule } from '@angular/forms'; // Đảm bảo rằng đã nhập module này


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
    QuestionToAskComponent
  ],
  imports: [
    CommonModule,
    QuestionToAskRoutingModule,
    FormsModule,
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
export class QuestionToAskModule { }