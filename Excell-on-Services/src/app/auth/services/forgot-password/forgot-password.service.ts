import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/Environments/environment';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  constructor(private httpClient: HttpClient) {}
  sendMail(email: string): Observable<any> {
    return this.httpClient.post<any>(
      `${baseUrl}/Auth/send-mail`,
      { email },
      {
        responseType: 'text' as 'json',
      }
    );
  }
  confirmOTP(otp: string, email: string): Observable<any> {
    return this.httpClient.post<any>(`${baseUrl}/Auth/confirm-otp`, {
      otp,
      email,
    });
  }
}
