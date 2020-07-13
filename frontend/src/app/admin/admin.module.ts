import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {ReactiveFormsModule} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';

import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from '../shared/shared.module';
import {AdminComponent} from './admin.component';
import {LoginComponent} from './login/login.component';
import {ErrorDialogComponent} from './login/error-dialog/error-dialog.component';
import {ErrorsTableComponent} from './errors-table/errors-table.component';
import { ServicesTableComponent } from './services-table/services-table.component';
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    MatIconModule
  ],
  declarations: [
    AdminComponent,
    LoginComponent,
    ErrorDialogComponent,
    ErrorsTableComponent,
    ServicesTableComponent
  ],
  providers: [CookieService],
  exports: [AppRoutingModule, AdminComponent]
})
export class AdminModule {
}
