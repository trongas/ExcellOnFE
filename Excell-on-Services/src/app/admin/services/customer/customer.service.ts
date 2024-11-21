import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/app/Environments/environment';
const baseUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private httpClient: HttpClient) {}

  getAllCustomer(): Observable<any[]> {
    const token = localStorage.getItem('tokenAdmin');

    // Tạo header với Bearer token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.get<any[]>(`${baseUrl}/Client`, { headers });
  }
  getCustomerById(id: number): Observable<any> {
    const token = localStorage.getItem('tokenAdmin');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.get<any>(`${baseUrl}/Client/${id}`, { headers });
  }



  updateCustomer(id: number, updatedData: any): Observable<any> {
    const token = localStorage.getItem('tokenAdmin');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.put<any>(`${baseUrl}/Client/${id}`, updatedData, {
      headers,
    });
  }

  deleteCustomer(id: number): Observable<any> {
    const token = localStorage.getItem('tokenAdmin');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient
      .delete<any>(`${baseUrl}/Client/${id}`, { headers })
      .pipe(
        tap(
          (response) => console.log('Delete request successful:', response),
          (error) => console.error('Delete request error:', error)
        )
      );
  }
}
