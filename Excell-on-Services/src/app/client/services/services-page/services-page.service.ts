import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/Environments/environment';
const baseUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class ServicesPageService {
  constructor(private httpClient: HttpClient) {}

  //  GET
  getService(): Observable<any> {
    const url = `${baseUrl}/Service`;
    return this.httpClient.get(url);
  }

  getServiceChargeByServiceId(serviceId: number): Observable<any> {
    const url = `${baseUrl}/ServiceCharges/getByServiceId/${serviceId}`;
    return this.httpClient.get(url);
  }
}
