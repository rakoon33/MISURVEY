import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatGridListModule } from '@angular/material/grid-list' 
import { MatMenuModule } from '@angular/material/menu'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar' 
import { MatTableModule } from '@angular/material/table'; 
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule} from '@angular/material/snack-bar' 
import { MatListModule} from '@angular/material/list';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule, 
    MatGridListModule, 
    MatMenuModule, 
    MatButtonModule, 
    MatCardModule, 
    MatIconModule, 
    MatExpansionModule, 
    MatListModule, 
    MatToolbarModule, 
    MatTableModule, 
    MatBadgeModule, 
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
