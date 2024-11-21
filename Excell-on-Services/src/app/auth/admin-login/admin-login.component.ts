import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Validators } from '@angular/forms';

import * as fromRoot from '../../State/index';
import * as fromAdmin from '../../State/admin';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;

  loading$: Observable<boolean> = new Observable();
  success$: Observable<boolean> = new Observable();
  error$: Observable<boolean> = new Observable();
  userEmail$: Observable<string> = new Observable();
  destroy$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private store: Store<fromRoot.IAppState>,
    private router: Router
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

    this.loading$ = this.store
      .select(fromAdmin.getAdminLoadingLogin)
      .pipe(takeUntil(this.destroy$));
    this.success$ = this.store
      .select(fromAdmin.getAdminSuccessLogin)
      .pipe(takeUntil(this.destroy$));
    this.error$ = this.store
      .select(fromAdmin.getAdminFailLogin)
      .pipe(takeUntil(this.destroy$));
    this.userEmail$ = this.store.select(fromAdmin.getAdminEmail);

    this.onLoginSuccess();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    const { email, password } = this.loginForm.value;
    this.store.dispatch(new fromAdmin.LoginAdmin({ email, password }));
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
          // Display or use userEmail as needed
          console.log('Admin:', userEmail);
        }
      });

      this.store
        .pipe(select(fromAdmin.getAdminToken), take(1))
        .subscribe((token) => {
          if (token) {
            localStorage.setItem('tokenAdmin', token);
            console.log('TokenAdmin from State:', token);
            this.router.navigate(['/admin/main']);
          }
        });
    });
  }
}
