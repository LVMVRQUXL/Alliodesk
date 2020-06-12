import {NgModule} from "@angular/core";

import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";

import {SharedComponentsModule} from "../shared/components/shared-components.module";
import {AdminComponent} from './admin.component';
import {LoginComponent} from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    SharedComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdminComponent,
    LoginComponent
  ],
  exports: [AdminComponent]
})
export class AdminModule {
}
