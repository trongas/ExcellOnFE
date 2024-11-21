import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PaymentHistoryService } from '../../services/payment-history/payment-history.service';
import { OrderDetail } from 'src/app/interfaces/orderDetail';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css'],
})
export class PaymentHistoryComponent implements OnInit {
  orders: any[] = [];
  public user?: any;
  constructor(
    private paymentHistoryService: PaymentHistoryService,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.fetchUserId();
  }

  fetchUserId(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.profileService.GetProfileByJwt(token).subscribe(
        (response: any) => {
          this.user = response.userProfile;
          this.fetchOrderHistory(this.user.id);
        },
        (error) => {
          console.error('Error fetching token:', error);
        }
      );
    } else {
      console.error('JWT token not found in local storage.');
    }
  }

  fetchOrderHistory(id: number): void {
    this.paymentHistoryService.getOrderHistory(id).subscribe({
      next: (data) => {
        this.orders = data;
        this.fetchServiceDetails();
      },
      error: (e) => console.error(e),
    });
  }

  fetchServiceDetails(): void {
    const serviceChargeIds = this.orders.reduce((acc, order) => {
      acc.push(
        ...order.orderDetail.map(
          (detail: OrderDetail) => detail.serviceChargeId
        )
      );
      return acc;
    }, []);

    this.paymentHistoryService.getServiceDetails(serviceChargeIds).subscribe({
      next: (serviceDetails) => {
        this.mergeServiceDetails(serviceDetails);
      },
      error: (e) => console.error(e),
    });
  }

  mergeServiceDetails(serviceDetails: any[]): void {
    this.orders.forEach((order) => {
      order.orderDetail.forEach((detail: OrderDetail) => {
        const service = serviceDetails.find(
          (service) => service.serviceChargeId === detail.serviceChargeId
        );
        if (service) {
          detail.serviceChargesName = service.serviceChargesName;
          detail.price = service.price;
          detail.serviceChargesDescription = service.serviceChargesDescription;
        }
      });
    });
  }
  getOrderStatus(status: number): string {
    switch (status) {
      case 1:
        return 'Pending';
      case 2:
        return 'Processing';
      case 3:
        return 'Completed';
      default:
        return 'Unknown';
    }
  }
}
