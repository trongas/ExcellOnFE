import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://localhost:7260/api';

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

  getOrderByClientId(clientId: number): Observable<any> {
    const headers = this.addTokenToHeader();

    return this.http.get<any>(`${this.apiUrl}/Order/getByClientId/${clientId}`,{ headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getOrderHistory(clientId: number): Observable<any> {
    const headers = this.addTokenToHeader();

    return this.http.get<any>(`${this.apiUrl}/Order/getByClientId/${clientId}`,{ headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getServiceChargesByServiceId(): Observable<any> {
    const headers = this.addTokenToHeader();

    return this.http.get<any>(`${this.apiUrl}/ServiceCharges`, {headers: headers})
    .pipe(
      catchError(this.handleError)
    );
  }


  getClient(): Observable<any[]> {
    const headers = this.addTokenToHeader();
    
    return this.http
      .get<any[]>(`${this.apiUrl}/Client`, { headers: headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching departments:', error);
          return throwError('Error fetching departments');
        })
      );
  }


  searchClientByName(name: string): Observable<any> {
    const headers = this.addTokenToHeader();
    const url = `${this.apiUrl}/Client/search?name=${name}`;
    return this.http.get(url, { headers });
  }
  
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
  
  getServiceDetails(serviceChargeIds: number[]): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/ServiceCharges`, { params: { serviceChargeIds: serviceChargeIds.join(',') }});
  }
}
