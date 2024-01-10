import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {QuestionConfigureComponent } from './question-configure.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionConfigureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionConfigureRoutingModule { }
