import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/app/Environments/environment';
const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartDetailTotalSubject: Subject<number> = new Subject<number>();
  cartDetailTotal$: Observable<number> =
    this.cartDetailTotalSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  updateCartDetailTotal(total: number): void {
    this.cartDetailTotalSubject.next(total);
  }
  getCartByClientId(clientId: number): Observable<any> {
    const url = `${baseUrl}/Cart/getByClientId/${clientId}`;
    return this.httpClient.get(url);
  }

  addCart(clientId: number, serviceChargesId: number): Observable<any> {
    const data = {
      clientId: clientId,
      serviceChargeId: serviceChargesId,
    };

    return this.httpClient.post<any>(`${baseUrl}/Cart/add-to-cart`, data, { responseType: 'text' as 'json' }).pipe(
      tap(() => {
        this.updateCartTotal(clientId);
      })
    );
  }

  deleteCartItemById(cartId: number, clientId: number): Observable<any> {
    const url = `${baseUrl}/Cart/${cartId}`;
    return this.httpClient.delete(url).pipe(
      tap(() => {
        // Update total items count after deleting from cart
        this.updateCartTotal(clientId);
      })
    );
  }
  deleteCartByClientId(clientId: number): Observable<any> {
    const url = `${baseUrl}/Cart/client/${clientId}`;
    return this.httpClient.delete(url).pipe();
  }

  updateCartTotal(clientId: number): void {
    this.getCartByClientId(clientId).subscribe({
      next: (data) => {
        this.updateCartDetailTotal(data.length);
      },
      error: (e) => console.error(e),
    });
  }
}
