import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SurveyReportDetailComponent } from './survey-report-detail.component';

const routes: Routes = [
  {
    path: '',
    component: SurveyReportDetailComponent,
    data: {
      title: 'Survey Report Detail',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyReportDetailRoutingModule {}

