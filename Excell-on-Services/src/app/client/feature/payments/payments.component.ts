import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { ServiceCharge } from 'src/app/interfaces/serviceCharge';
import { ProfileService } from '../../services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../services/order/order.service';
import { Observable, forkJoin } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  serviceCharges: { [clientId: number]: ServiceCharge[] } = {};
  token: string | null = localStorage.getItem('token');
  userProfile: any;
  userId: number | undefined;
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private profileService: ProfileService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  handler: any = null;

  ngOnInit() {
    this.getCartByUserId();
  }

  async getCartByUserId(): Promise<void> {
    if (this.token !== null) {
      this.profileService.GetProfileByJwt(this.token).subscribe(
        (response) => {
          this.userProfile = response.userProfile;

          if (this.userProfile && this.userProfile.id) {
            this.userId = this.userProfile.id;
            this.userId !== undefined
              ? this.getCart(this.userId)
              : console.error(
                  'User ID is undefined. Handle this case appropriately.'
                );
          } else {
            console.error(
              'User profile or user ID is missing. Handle this case appropriately.'
            );
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      console.error('Token is null. Handle this case appropriately.');
    }
  }

  async getCart(clientId: number): Promise<void> {
    if (!this.serviceCharges[clientId]) {
      this.cartService.getCartByClientId(clientId).subscribe({
        next: (data) => {
          this.serviceCharges[clientId] = data;
          this.totalPrice = this.calculateTotalPrice();
        },
        error: (e) => console.error(e),
      });
    }
  }

  calculateTotalPrice(): number {
    let total = 0;
    for (const clientId in this.serviceCharges) {
      if (this.serviceCharges.hasOwnProperty(clientId)) {
        const charges = this.serviceCharges[clientId];
        for (const charge of charges) {
          total += charge.price;
        }
      }
    }
    return total;
  }

  deleteCartItem(cartItemId: number, clientId: number): void {
    Swal.fire({
      width: 350,
      title: 'Delete',
      text: 'Are you sure you want to delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#FFC374',
      confirmButtonText: 'Delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteCartItemById(cartItemId, clientId).subscribe({
          next: () => {
            if (this.serviceCharges[clientId]) {
              this.serviceCharges[clientId] = this.serviceCharges[
                clientId
              ].filter((item) => item.cartId !== cartItemId);
              this.totalPrice = this.calculateTotalPrice();
            }
            this.toastr.success('Delete successful!', 'Success');
          },
          error: (error) => {
            console.error('Error deleting cart item:', error);
            this.toastr.error('Error deleting cart item', 'Error');
          },
        });
      }
    });
  }

  addOrder(): void {
    if (!this.userId) {
      console.error('User ID is undefined. Handle this case appropriately.');
      return;
    }

    const orderData = {
      clientId: this.userId,
      orderTotal: this.totalPrice,
      orderStatus: 1,
      orderDate: new Date().toISOString(),
    };

    this.orderService.addOrder(orderData).subscribe(
      (res) => {
        if (res && res.includes('Order successfully created. Order ID:')) {
          const orderId = parseInt(res.split(':')[1].trim());
          this.addOrderDetails(orderId);
          this.toastr.success('Order placed successfully!', 'Success');
        } else {
          console.error('Unexpected response from server:', res);
          this.toastr.error('Unexpected response from server', 'Error');
        }
      },
      (error) => {
        console.error('Error creating order:', error);
        this.toastr.error('Error creating order', 'Error');
      }
    );
  }

  addOrderDetails(orderId: number): void {
    const orderDetailRequests: Observable<any>[] = [];

    for (const clientId in this.serviceCharges) {
      if (this.serviceCharges.hasOwnProperty(clientId)) {
        const charges = this.serviceCharges[clientId];
        for (const charge of charges) {
          const orderDetailData = {
            orderId: orderId,
            serviceChargesId: charge.serviceChargeId,
          };
          orderDetailRequests.push(
            this.orderService.addOrderDetail(orderDetailData)
          );
        }
      }
    }

    forkJoin(orderDetailRequests).subscribe(
      () => {
        this.toastr.success('Order placed successfully!', 'Success');
        this.deleteCart();
      },
      (error) => {
        console.error('Error adding order details:', error);
        this.toastr.error('Error adding order details', 'Error');
      }
    );
  }

  async deleteCart(): Promise<void> {
    if (this.token !== null) {
      this.profileService.GetProfileByJwt(this.token).subscribe(
        (response) => {
          this.userProfile = response.userProfile;
          if (this.userProfile && this.userProfile.id) {
            this.userId = this.userProfile.id;
            this.userId !== undefined
              ? this.cartService
                  .deleteCartByClientId(this.userId)
                  .subscribe(() => {
                    this.cartService.updateCartDetailTotal(0);
                    this.serviceCharges = {};
                    this.totalPrice = 0;
                  })
              : console.error(
                  'User ID is undefined. Handle this case appropriately.'
                );
          } else {
            console.error(
              'User profile or user ID is missing. Handle this case appropriately.'
            );
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      console.error('Token is null. Handle this case appropriately.');
    }
  }
}
