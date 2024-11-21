import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/app/Environments/environment';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private cartDetailTotalSubject: Subject<number> = new Subject<number>();
  cartDetailTotal$: Observable<number> =
    this.cartDetailTotalSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  updateCartDetailTotal(total: number): void {
    this.cartDetailTotalSubject.next(total);
  }

  addOrder(orderData: any): Observable<any> {
    return this.httpClient.post<any>(
      `${baseUrl}/Order/create-order`,
      orderData,{ responseType: 'text' as 'json' }
    );
  }
  addOrderDetail(orderDetailData: any): Observable<any> {
    return this.httpClient.post<any>(
      `${baseUrl}/Order/order-detail`,
      orderDetailData,{ responseType: 'text' as 'json' }
    );
  }

  deleteOrder(orderId: number): Observable<any> {
    const url = `${baseUrl}/Order/${orderId}`;
    return this.httpClient.delete(url);
  }
  getOrder(): Observable<any> {
    const url = `${baseUrl}/Order`;
    return this.httpClient.get(url);
  }
}
