import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { IClientState } from '../../State/client/client.states';
import * as fromClient from '../../State/client/client.actions';
import { environment } from 'src/app/Environments/environment';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient, private store: Store<IClientState>) {
    // Check for authentication status on initialization
    this.checkAuthenticationStatus();
  }

  private checkAuthenticationStatus() {
    const token = localStorage.getItem('token');

    if (token) {
      // Dispatch an action to set the authentication status
      this.store.dispatch(new fromClient.LoginSuccess({ userName: '', token }));
    }
  }


  login(email: string, password: string): Observable<{ result: boolean; token: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };

    return this.http.post<{ result: boolean; token: string }>(`${baseUrl}/Auth/client-login`, body, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    password: string;
  }): Observable<{ result: boolean; token: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ result: boolean; token: string }>(`${baseUrl}/Auth/client-register`, data, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Registration failed:', error);
        throw error;
      })
    );
  }

  // New method for logging out
  logout(): void {
    // Clear token from local storage
    localStorage.removeItem('token');

    // Optionally, dispatch a LOGOUT action to notify the state about the logout
    this.store.dispatch(new fromClient.Logout());
  }

  public authToken = localStorage.getItem('token');

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }
}
