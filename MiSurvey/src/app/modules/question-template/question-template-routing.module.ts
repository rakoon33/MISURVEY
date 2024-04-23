import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionTemplateManagementComponent } from './question-template.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionTemplateManagementComponent,
    data: {
      title: 'Question Template Management',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionTemplateManagementRoutingModule {}
