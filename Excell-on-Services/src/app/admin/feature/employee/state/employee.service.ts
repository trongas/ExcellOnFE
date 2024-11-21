// employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7260/api/Employee';

  constructor(private http: HttpClient) {}

  private addToken(): HttpHeaders {
    const token = localStorage.getItem('tokenAdmin');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private addTokenToHeader(): HttpHeaders {
    const token = localStorage.getItem('tokenAdmin');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getEmployees(): Observable<any[]> {
    const headers = this.addTokenToHeader();
    return this.http.get<any[]>(`${this.apiUrl}`, { headers });
  }

  updateEmployee(employee: FormData): Observable<any> {
    const token = localStorage.getItem('tokenAdmin');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.put(`${this.apiUrl}/Update`, employee, { headers });
  }
  
  

  deleteEmployee(employeeId: number): Observable<any> {
    const headers = this.addTokenToHeader();
    return this.http.delete<any>(`${this.apiUrl}/Delete?id=${employeeId}`, { headers });
  }
  getEmployeesByDepartmentId(departmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${departmentId}`);
  }

  searchEmployeesByName(name: string): Observable<any> {
    const headers = this.addTokenToHeader();
    const url = `${this.apiUrl}/search?name=${name}`;
    return this.http.get(url, { headers });
  }

}
