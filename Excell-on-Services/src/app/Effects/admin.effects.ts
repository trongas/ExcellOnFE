import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Router } from '@angular/router';

import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as fromAdmin from '../State/admin/admin.actions';
import { of } from 'rxjs';
import { AdminService } from '../auth/services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AdminEffects {
  constructor(
    private actions: Actions,
    private AdminService: AdminService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  login$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromAdmin.EAdminActions.LOGIN_ADMIN),
      switchMap((action: fromAdmin.LoginAdmin) => {
        const { email, password } = action.payload;
        return this.AdminService.login(email, password).pipe(
          map((response) => {
            console.log('API Response:', response);
            if (response.result) {
              // Save tokenAdmin to local storage
              
              localStorage.setItem('tokenAdmin', response.token);

              // Trigger an alert for successful login
              this.toastr.success('Login Admin successful!', 'Success');

              // Navigate to a component that displays the alert

              return new fromAdmin.LoginSuccessAdmin({
                userName: email,
                tokenAdmin: response.token,
                
              });
              
            } else {
              // Trigger an alert for unsuccessful login
              this.toastr.error('Login Admin Failed!', 'Error');
              return new fromAdmin.LoginFailAdmin();
            }
          }),
          catchError(() => {
            // Trigger an alert for unsuccessful login due to an error
            this.toastr.error('Login Admin failed. Please check your credentials.', 'Error');
            return of(new fromAdmin.LoginFailAdmin());
          })
        );
      })
    )
  );

  

  // New effect for handling LOGOUT
  logout$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromAdmin.EAdminActions.LOGOUT_ADMIN),
      tap(() => {
        // Clear tokenAdmin from local storage
        localStorage.removeItem('tokenAdmin');
        
      })
    ),
    { dispatch: false } 
  );
}
