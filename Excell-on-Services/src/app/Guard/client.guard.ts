// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import * as fromClient from '../State/client';

@Injectable({
  providedIn: 'root',
})
export class AuthClientGuard implements CanActivate {
  constructor(private store: Store<fromClient.IClientState>, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.pipe(
      select(fromClient.getIsLoggedOut),
      take(1),
      map((isLoggedOut) => {
        if (!isLoggedOut) {
          // User is logged in, allow access
          return true;
        } else {
          // User is not logged in, redirect to login page
          return this.router.createUrlTree(['/auth/login']);
        }
      })
    );
  }
}
