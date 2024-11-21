import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/app/Environments/environment';
const baseUrl = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class ServiceChargeService {

  constructor(private httpClient: HttpClient) {}

  getAllService(): Observable<any[]> {
    const token = localStorage.getItem('token');

    // Tạo header với Bearer token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.get<any[]>(`${baseUrl}/ServiceCharges`, { headers });
  }
  getServiceById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.get<any>(`${baseUrl}/ServiceCharges/getByServiceId/${id}`, { headers });
  }



  updateService(id: number, updatedData: any): Observable<any> {
    const token = localStorage.getItem('tokenAdmin');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.put<any>(`${baseUrl}/ServiceCharges/${id}`, updatedData, {
      headers,
    });
  }

  deleteService(id: number): Observable<any> {
    const token = localStorage.getItem('tokenAdmin');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient
      .delete<any>(`${baseUrl}/ServiceCharges/${id}`, { headers })
      .pipe(
        tap(
          (response) => console.log('Delete request successful:', response),
          (error) => console.error('Delete request error:', error)
        )
      );
  }

  addService(newService: any): Observable<any> {
    const token = localStorage.getItem('tokenAdmin');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.post<any>(`${baseUrl}/ServiceCharges`, newService, { headers });
  }
}
