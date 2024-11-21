// department.service.ts
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Employee } from '../model/employee.model';
import { Department } from '../model/department.model';
import { UpdateDepartmentDto } from '../edit-department/update-department.dto';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = 'https://localhost:7260/api'; // Thay đổi URL ở đây

  constructor(private http: HttpClient) {}

  private addTokenToHeader(): HttpHeaders {
    const token = localStorage.getItem('tokenAdmin');
    if (!token) {
      // Handle the case where the token is not present
      console.warn('Token not found in localStorage');
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Lấy danh sách tất cả các phòng ban
  getDepartments(): Observable<Department[]> {
    const headers = this.addTokenToHeader();

    return this.http
      .get<Department[]>(`${this.apiUrl}/Department`, { headers: headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching departments:', error);
          return throwError('Error fetching departments');
        })
      );
  }

  // Lấy thông tin một phòng ban theo ID
  getDepartmentById(id: number): Observable<any> {
    const headers = this.addTokenToHeader();
    const url = `${this.apiUrl}/Department/${id}`;

    return this.http.get(url, { headers: headers });
  }

  getEmployeeById(employeeId: number): Observable<Employee> {
    const headers = this.addTokenToHeader();

    return this.http.get<Employee>(`https://localhost:7260/${employeeId}`, {
      headers: headers,
    });
  }

  // Thêm một phòng ban mới
  addDepartment(departmentData: any): Observable<any> {
    const headers = this.addTokenToHeader();

    return this.http.post<any>(`${this.apiUrl}/Department`, departmentData, {
      headers: headers,
    });
  }

  //Gọi API để lấy danh sách nhân viên trong phòng ban
  getEmployeesByDepartmentId(departmentId: number): Observable<any> {
    const headers = this.addTokenToHeader();

    return this.http.get(
      `${this.apiUrl}/Employee/getByDepartmentId/${departmentId}`,
      { headers: headers }
    );
  }

  // Cập nhật thông tin một phòng ban
  updateDepartment(updateData: UpdateDepartmentDto): Observable<any> {
    const headers = this.addTokenToHeader();
    const url = `${this.apiUrl}/Department/Update`;

    return this.http.put(url, updateData, { headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating department:', error);
        return throwError(error);
      })
    );
  }

  // Xóa một phòng ban
  deleteDepartment(id: number): Observable<any> {
    const headers = this.addTokenToHeader();

    return this.http.delete<any>(`${this.apiUrl}/Department/Delete?id=${id}`, {
      headers: headers,
    });
  }
}
