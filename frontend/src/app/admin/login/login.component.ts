import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {AdminService} from "../../shared/services/admin.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  private loginInputControl: FormControl;
  private passwordInputControl: FormControl;
  private loginInputInitialValue = '';
  private passwordInputInitialValue = '';

  constructor(private formBuilder: FormBuilder,
              private adminService: AdminService) {
    this.initLoginForm(formBuilder);
  }

  /**
   * Initializes the login form.
   *
   * @param formBuilder {FormBuilder} The form builder service
   */
  private initLoginForm(formBuilder: FormBuilder): void {
    this.loginInputControl = formBuilder.control(
      this.loginInputInitialValue, Validators.required
    );
    this.passwordInputControl = formBuilder.control(
      this.passwordInputInitialValue, Validators.required
    );

    this.loginForm = formBuilder.group({
      login: this.loginInputControl,
      password: this.passwordInputControl
    });
  }

  /**
   * Submits the inputs to the API for login submission.
   */
  loginSubmission(): void {
    if (!this.loginForm.valid) console.log('Invalid inputs!');
    else {
      this.adminService.loginAdmin({
        login: this.loginInputControl.value,
        password: this.passwordInputControl.value
      }).subscribe(token => console.log(token));
    }
  }

  /**
   * Resets the inputs to their initial values.
   */
  resetInputs(): void {
    this.loginInputControl.setValue(this.loginInputInitialValue);
    this.passwordInputControl.setValue(this.passwordInputInitialValue);
  }

}
