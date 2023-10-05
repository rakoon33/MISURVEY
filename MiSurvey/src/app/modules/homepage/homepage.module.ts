import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageRoutingModule } from './home-routing.module';
import { HomepageComponent } from './homepage.component';
import { HomepageComponentExampleComponent } from './components/homepage-component-example/homepage-component-example.component';

@NgModule({
  declarations: [HomepageComponent, HomepageComponentExampleComponent],
  imports: [
    CommonModule,
    HomePageRoutingModule
  ]
})
export class HomePageModule { }