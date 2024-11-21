// data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private baseUrl = 'https://localhost:7260'; 

  constructor(private http: HttpClient) { }

  getTotalEmployee(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/dashboard/total-employee`);
  }

  getClientCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/dashboard/client-count`);
  }

  getDepartmentCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/dashboard/department-count`);
  }

  getRevenue(year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/dashboard/revenue?year=${year}`);
  }

  getTotalClientOfService(serviceId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/dashboard/total-client-of-service?serviceId=${serviceId}`);
  }
  getService(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/Service`)
  }
}
