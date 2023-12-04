import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  declarations: [
    CustomInputComponent,
    LoadingComponent  
  ],
  imports: [
    CommonModule,
    FormsModule,
    LottieModule  
  ],
  exports: [
    CustomInputComponent,
    LoadingComponent  
  ]
})
export class ShareModule { }
