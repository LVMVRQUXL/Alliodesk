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

  constructor(private formBuilder: FormBuilder) {
    this.initLoginForm(formBuilder);
  }

  ngOnInit(): void {
  }

  private initLoginForm(formBuilder: FormBuilder) {
    this.loginInputControl = formBuilder.control('', Validators.required);
    this.passwordInputControl = formBuilder.control('', Validators.required);

    this.loginForm = formBuilder.group({
      login: this.loginInputControl,
      password: this.passwordInputControl
    });
  }

  private loginSubmission() {
    if (this.loginForm.valid) console.log(this.loginForm.value);
    else console.log('Invalid inputs!');
  }

  private resetInputs() {
    this.loginInputControl.setValue('');
    this.passwordInputControl.setValue('');
  }

}
