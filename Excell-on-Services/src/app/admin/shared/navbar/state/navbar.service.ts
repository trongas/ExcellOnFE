// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private apiUrl = 'https://localhost:7260/api/Employee'; // Đặt URL cho lấy thông tin người dùng

  constructor(private http: HttpClient) {}

  getLoggedInUser(token: string): Observable<any> {
    // Gọi API để lấy thông tin nhân viên với token JWT
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(this.apiUrl, { headers });
  }

}
