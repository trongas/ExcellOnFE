import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/Environments/environment';

const baseUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  GetProfileByJwt(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'accept': '*'
    });

    const url = `${baseUrl}/Auth/GetEmployeeProfileByJwt?token=${token}`;
    return this.httpClient.post(url, {}, { headers });
  }
  updateProfile(id: number, updatedData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.put<any>(`${baseUrl}/Client/${id}`, updatedData, {
      headers,
    });
  }
}
