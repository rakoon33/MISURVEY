import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionToAskComponent } from './question-to-ask.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionToAskComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionToAskRoutingModule { }
