import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BadgeModule, CardModule, GridModule } from '@coreui/angular';
import { ChartjsModule } from '@coreui/angular-chartjs';

import { SurveyReportDetailComponent } from './survey-report-detail.component';
import { SurveyReportDetailRoutingModule } from './survey-report-detail-routing.module';
import { DocsComponentsModule } from '@docs-components/docs-components.module';

@NgModule({
  declarations: [SurveyReportDetailComponent],
  imports: [
    CommonModule,
    SurveyReportDetailRoutingModule,
    ChartjsModule,
    CardModule,
    GridModule,
    BadgeModule,
    DocsComponentsModule
  ]
})
export class SurveyReportDetailModule {
}
