import {NgModule} from "@angular/core";

import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";

import {SharedModule} from "../shared/shared.module";
import {AdminComponent} from './admin.component';
import {LoginComponent} from './login/login.component';

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [AdminComponent, LoginComponent],
  providers: [CookieService],
  exports: [AdminComponent]
})
export class AdminModule {
}
