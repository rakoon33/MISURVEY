import { ShareModule } from './../../../shared/share.module';

import { SurveyInfoComponent } from './survey-info.component';
import { SurveyInfoRoutingModule } from './survey-info-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        SurveyInfoComponent,
    ],
    imports: [
        CommonModule,
        SurveyInfoRoutingModule,
        FormsModule,
        ShareModule
    ]
})
export class SurveyInfoModule { }