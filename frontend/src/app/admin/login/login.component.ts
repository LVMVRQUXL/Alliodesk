import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  private loginInputControl: FormControl;
  private passwordInputControl: FormControl;
  private loginInputInitialValue = '';
  private passwordInputInitialValue = '';

  constructor(private formBuilder: FormBuilder) {
    this.initLoginForm(formBuilder);
  }

  ngOnInit(): void {
  }

  /**
   * Initializes the login form.
   *
   * @param formBuilder {FormBuilder}
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
   * It currently logs the login inputs, but this will change in future commits.
   *
   * TODO: link with dedicated service!
   */
  private loginSubmission(): void {
    console.log((this.loginForm.valid) ? this.loginForm.value : 'Invalid inputs!');
  }

  /**
   * Resets the inputs to their initial values.
   */
  private resetInputs(): void {
    this.loginInputControl.setValue(this.loginInputInitialValue);
    this.passwordInputControl.setValue(this.passwordInputInitialValue);
  }

}
