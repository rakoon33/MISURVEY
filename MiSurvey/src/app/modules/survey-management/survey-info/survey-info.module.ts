
import { SurveyInfoComponent } from './survey-info.component';
import { SurveyInfoRoutingModule } from './survey-info-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/shared/share.module';
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