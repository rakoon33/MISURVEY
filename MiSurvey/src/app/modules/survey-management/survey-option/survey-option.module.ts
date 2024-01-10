import { SurveyOptionRoutingModule } from './survey-option-routing.module';
import { SurveyOptionComponent } from './survey-option.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@NgModule({
    declarations: [
        SurveyOptionComponent,
    ],
    imports: [
        CommonModule,
        SurveyOptionRoutingModule,
        FormsModule,
    ]
})
export class SurveyOptionModule { }