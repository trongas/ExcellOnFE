import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, take, takeUntil } from 'rxjs';

import * as fromRoot from '../../State/index';
import * as fromUser from '../../State/client';
import { Router } from '@angular/router';
import { ForgotPasswordService } from '../services/forgot-password/forgot-password.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('otpInput') otpInput!: ElementRef;
  loginForm: FormGroup;

  loading$: Observable<boolean> = new Observable();
  success$: Observable<boolean> = new Observable();
  error$: Observable<boolean> = new Observable();
  userEmail$: Observable<string> = new Observable();
  destroy$: Subject<void> = new Subject();
  userEmail: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromRoot.IAppState>,
    private router: Router,
    private emailService: ForgotPasswordService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: '',
      password: '',
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      password: ['', [Validators.required, this.passwordValidator]],
    });
    this.loginForm.addControl(
      'otpCode',
      this.fb.control('', Validators.required)
    );
    this.loading$ = this.store
      .select(fromUser.getLoadingLogin)
      .pipe(takeUntil(this.destroy$));
    this.success$ = this.store
      .select(fromUser.getSuccessLogin)
      .pipe(takeUntil(this.destroy$));
    this.error$ = this.store
      .select(fromUser.getFailLogin)
      .pipe(takeUntil(this.destroy$));
    this.userEmail$ = this.store.select(fromUser.getUserEmail);

    this.onLoginSuccess();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    const { email, password } = this.loginForm.value;
    this.store.dispatch(new fromUser.Login({ email, password }));
  }
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
  emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }
  onLoginSuccess() {
    this.success$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.userEmail$.pipe(take(1)).subscribe((userEmail) => {
        if (userEmail) {
          localStorage.setItem('userEmail', userEmail);
          // console.log('User Email:', userEmail);
        }
      });

      this.store.pipe(select(fromUser.getToken), take(1)).subscribe((token) => {
        if (token) {
          localStorage.setItem('token', token);
          this.router.navigate(['/user/home']);
        }
      });
    });
  }

  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  showForgotPassword: boolean = false;
  forgotPasswordEmail: string = '';
  showOTPComponent: boolean = false;
  otpCode: string = '';

  showForgotPasswordInput(): void {
    this.showForgotPassword = true;
  }

  sendForgotPasswordEmail(): void {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.error('User email not found in local storage.');
      return;
    }
    console.log('User email FORgot', userEmail);
    this.emailService.sendMail(userEmail).subscribe(
      (response) => {
        this.toastr.success(
          'Check the email registered your account!!',
          'Success'
        );
        console.log('Email sent successfully:', response);
        this.forgotPasswordEmail = '';
        this.showForgotPassword = false;
        this.showOTPComponent = true;
      },
      (error) => {
        this.toastr.error('Error sending email!', 'Error');
        console.error('Error sending email:', error);
      }
    );
  }
  verifyOTP(): void {
    const userEmail = localStorage.getItem('userEmail');
    const otpCode = this.otpInput.nativeElement.value; // Assuming otpCode is a string

    if (userEmail) {
      this.emailService
        .confirmOTP(otpCode, userEmail)
        .toPromise()
        .then(
          (response) => {
            console.log('OTP confirmed successfully:', response);
            console.log('OTP confirmed successfully:', response.result);
            if (response && response.token) {
              this.toastr.success('Login successful!', 'Success');
              localStorage.setItem('token', response.token);

              this.navigateToHomeAndReload();
            } else {
              this.toastr.error('Error OTP!', 'Error');
              console.error('Token is undefined in the response.');
            }
          },
          (error) => {
            this.toastr.error('Error OTP!', 'Error');
            console.error('Error confirming OTP:', error);
          }
        );
    } else {
      this.toastr.error('Error OTP!', 'Error');
      console.error('User email is null');
    }
  }
  navigateToHomeAndReload(): void {
    this.router
      .navigateByUrl('/user/home', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/user/home']);
        window.location.reload();
      });
  }
}
