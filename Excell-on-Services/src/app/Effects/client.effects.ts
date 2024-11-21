import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Router } from '@angular/router';
import { ClientService } from '../auth/services/client.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as fromClient from '../State/client/client.actions';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ClientEffects {
  constructor(
    private actions: Actions,
    private clientService: ClientService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  login$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromClient.EClientActions.LOGIN),
      switchMap((action: fromClient.Login) => {
        const { email, password } = action.payload;
        return this.clientService.login(email, password).pipe(
          map((response) => {
            if (response.result) {
              // Save token to local storage
              localStorage.setItem('token', response.token);

              // Trigger an alert for successful login
              this.toastr.success('Login successful!', 'Success');
              // Navigate to a component that displays the alert

              return new fromClient.LoginSuccess({
                userName: email,
                token: response.token,
              });
            } else {
              // Trigger an alert for unsuccessful login
              this.toastr.error('Login Failed!', 'Error');
              return new fromClient.LoginFail();
            }
          }),
          catchError(() => {
            // Trigger an alert for unsuccessful login due to an error
            this.toastr.error('Login failed. Please check your credentials.', 'Error');
            return of(new fromClient.LoginFail());
          })
        );
      })
    )
  );

  register$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromClient.EClientActions.REGISTER),
      switchMap((action: fromClient.Register) => {
        const { firstName, lastName, phone, dob, email, password } = action.payload;
        return this.clientService
          .register({ firstName, lastName, phone, dob, email, password })
          .pipe(
            map((response) => {
              if (response.result) {
                // Save token to local storage
                localStorage.setItem('token', response.token);

                // Trigger an alert for successful registration
                this.toastr.success('Registration successful!', 'Success');

                return new fromClient.RegisterSuccess({
                  token: response.token,
                });
              } else {
                // Trigger an alert for unsuccessful registration
                this.toastr.error('Registration Failed!', 'Error');
                return new fromClient.RegisterFail();
              }
            }),
            catchError((error) => {
              // Extract error message from HttpErrorResponse
              const errorMessage = error.error;
              
              // Display error message using Toastr
              this.toastr.error(errorMessage, 'Error');

              return of(new fromClient.RegisterFail());
            })
          );
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromClient.EClientActions.LOGOUT),
      tap(() => {
        // Clear tokenAdmin from local storage
        localStorage.removeItem('token');
      })
    ),
    { dispatch: false } 
  );
}
