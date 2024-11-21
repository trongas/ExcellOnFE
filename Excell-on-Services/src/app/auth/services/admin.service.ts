import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../State/admin/admin.actions';
import { IAdminState } from 'src/app/State/admin';
import { Observable, catchError, map } from 'rxjs';

const baseUrl = 'https://localhost:7260/api';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private store: Store<IAdminState>) {
    // Check for authentication status on initialization
    this.checkAuthenticationStatus();
  }

  private checkAuthenticationStatus() {
    const tokenAdmin = localStorage.getItem('tokenAdmin');

    if (tokenAdmin) {
      // Dispatch an action to set the authentication status
      this.store.dispatch(new fromAdmin.LoginSuccessAdmin({ userName: '', tokenAdmin }));
    }
  }

 

  login(email: string, password: string): Observable<{ result: boolean; token: string }> {
    const body = { email, password };
  
    return this.http.post<{ result: boolean; token: string }>(`${baseUrl}/Auth/Emp-Login`, body).pipe(
      map(response => response),
      catchError(error => {
        console.error('Login failed:', error);
        // Xử lý lỗi ở đây, ví dụ: hiển thị thông báo lỗi cho người dùng
        // Hoặc dispatch một action để xử lý lỗi trong store
        throw error;
      })
    );
  }


  // New method for logging out
  logout(): void {
    // Clear tokenAdmin from local storage
    localStorage.removeItem('tokenAdmin');

    // Optionally, dispatch a LOGOUT action to notify the state about the logout
    this.store.dispatch(new fromAdmin.LogoutAdmin());
  }
}
