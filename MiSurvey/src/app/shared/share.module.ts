import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomInputComponent } from './components/custom-input/custom-input.component';

@NgModule({
  declarations: [CustomInputComponent],
  imports: [CommonModule, FormsModule],
  exports: [CustomInputComponent]
})
export class SharedModule { }