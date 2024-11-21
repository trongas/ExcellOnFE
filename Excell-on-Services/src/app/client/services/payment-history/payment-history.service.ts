import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/Environments/environment';
const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PaymentHistoryService {

  constructor(private httpClient: HttpClient) {}

  getOrderHistory(clientId: number): Observable<any> {
    const url = `${baseUrl}/Order/getByClientId/${clientId}`;
    return this.httpClient.get(url);
  }

  getServiceDetails(serviceChargeIds: number[]): Observable<any[]> {
    return this.httpClient.get<any[]>(`${baseUrl}/ServiceCharges`, { params: { serviceChargeIds: serviceChargeIds.join(',') }});
  }
}
