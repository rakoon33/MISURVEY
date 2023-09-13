import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HighlightDirective } from './directives/highlight.directive';
import { CapitalizePipe } from './pipes/capitalize.pipe';



@NgModule({
  declarations: [
    HeaderComponent,
    HighlightDirective,
    CapitalizePipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
