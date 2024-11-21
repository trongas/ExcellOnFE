import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { ClientService } from 'src/app/auth/services/client.service';
import * as fromClient from '../../State/client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registrationForm: FormGroup;
  showPassword: boolean = false;
  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private store: Store,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      password: [
        '',
        [Validators.required, Validators.minLength(6), this.passwordValidator],
      ],
      phone: [
        '',
        [Validators.required, Validators.minLength(6), this.phoneValidator],
      ],
      dob: ['', [Validators.required, this.dateOfBirthValidator]],
    });
  }

  // Custom validator for first name and last name
  nameValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const namePattern = /^[a-zA-Z\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]*$/;
    if (!namePattern.test(control.value)) {
      return { invalidName: true };
    }
    return null;
  }

  // Custom validator for email
  emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  // Custom validator for password
  passwordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordPattern.test(control.value)) {
      return { invalidPassword: true };
    }
    return null;
  }
  phoneValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const phonePattern = /^[0-9]*$/;
    if (!phonePattern.test(control.value)) {
      return { invalidPhone: true };
    }
    return null;
  }

  dateOfBirthValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const birthDate = new Date(control.value);
    const currentDate = new Date();
    const ageInMilliseconds = currentDate.getTime() - birthDate.getTime();
    const ageInYears = ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000);
  
    if (ageInYears < 18) {
      return { 'invalidDOB': true };
    }
  
    return null;
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;

      // Dispatch the Register action to trigger the NgRx effect
      this.store.dispatch(new fromClient.Register(formData));

      this.router.navigate(['/auth/login']);
    }
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
