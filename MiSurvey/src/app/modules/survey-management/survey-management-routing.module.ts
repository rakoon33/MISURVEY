import { SurveyManagementComponent } from './survey-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SurveyManagementComponent,
    data: {
      title: 'Survey Management',
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyManagementRoutingModule {}
