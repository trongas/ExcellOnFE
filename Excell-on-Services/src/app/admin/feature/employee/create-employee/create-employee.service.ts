// employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'https://localhost:7260/api/Auth/EmployeeRegister'; // Thay đổi thành địa chỉ API thực tế của bạn
  private employeeCreatedSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  createEmployee(newEmployee: any): Observable<any> {
    const url = `${this.baseUrl}`; // Điều chỉnh đường dẫn API của bạn
  
    // Tạo FormData để chứa dữ liệu và append từng trường vào đó
    const formData = new FormData();
    for (const key in newEmployee) {
      if (newEmployee.hasOwnProperty(key)) {
        formData.append(key, newEmployee[key]);
      }
    }
  
    // Gửi yêu cầu POST với FormData và headers
    return this.http.post(url, formData, { headers: this.addTokenToHeader() });
  }

  getEmployees(): Observable<any[]> {
    const headers = this.addTokenToHeader();
    return this.http.get<any[]>(`https://localhost:7260/api/Employee`, { headers });
  }

  // Add a method to get the subject for employee creation
  getEmployeeCreatedSubject(): Subject<void> {
    return this.employeeCreatedSubject;
  }

  employeeCreated(): void {
    this.employeeCreatedSubject.next();
  }

  private addTokenToHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  
}
