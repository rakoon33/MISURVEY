import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyReportComponent } from './survey-report.component';

const routes: Routes = [
  {
    path: '',
    component: SurveyReportComponent,
    data: {
      title: 'Survey Report Management',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyReportRoutingModule {}
