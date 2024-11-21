import { Component, OnInit } from '@angular/core';
import { PaymentService } from './payment-services/payment.service';
import { Router } from '@angular/router';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Order } from './model/order';
import { OrderDetail } from 'src/app/interfaces/orderDetail';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  clients: any[] = [];
  orders: any[] = [];
  serviceCharges: any[] = [];

  selectedClientId: number | null = null;
  selectedClient: any | null = null;
  selectedOrder: any | null = null;
  searchTerm: string = '';
  showNoResultsMessage: boolean = false;
  showSearchResults: boolean = false;
  error: string | undefined;
  sortBy: 'name' | 'date' | 'status' | 'total' = 'name';
  currentPage = 1;
  itemsPerPage = 7;

  totalOrderAmount: number = 0;

  constructor(
    private paymentService: PaymentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClient();
    this.calculateTotalOrderAmount();
  
  }

  loadClient(): void {
    this.paymentService.getClient().subscribe(
      (clients: any[]) => {
        this.clients = clients;
        
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  

  addServiceChargesNameToOrders(): void {
    this.orders.forEach(order => {
      this.paymentService.getServiceChargesByServiceId().subscribe(
        (serviceCharges) => {
          order.serviceChargesName = serviceCharges?.serviceChargesName; 
          console.error(order.serviceChargesName);
        },
        (error) => {
          console.error('Error fetching service charges:', error);
        }
      );
    });
  }
  
  getOrdersByClientId(clientId: number): void {
    this.paymentService.getOrderByClientId(clientId).subscribe(
      (orders: Order[]) => {
        this.orders = orders;
        this.calculateTotalOrderAmount();
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  fetchOrderHistory(ClientId: number): void {
    this.paymentService.getOrderHistory(ClientId).subscribe({
      next: (data) => {
        this.orders.push(...data);
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

    this.paymentService.getServiceDetails(serviceChargeIds).subscribe({
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
          console.log(detail); // Kiểm tra dữ liệu

        }
      });
    });
  }
  
  showPayment(clientId: number) {
    this.selectedClientId = clientId;
    this.selectedClient = this.clients.find(client => client.clientId === clientId);
    this.selectedOrder = this.orders.find(order => order.clientId === clientId);
    this.getOrdersByClientId(clientId);
    this.fetchOrderHistory(clientId);
  }

  searchByName() {
    if (this.searchTerm.trim() !== '') {
      this.paymentService.searchClientByName(this.searchTerm).subscribe(
        (clients) => {
          this.clients = clients;
          this.showSearchResults = true;
          this.showNoResultsMessage = clients.length === 0;
        },
        (error) => {
          console.error('Error searching clients:', error);
          this.error = 'Error occurred while searching clients.';
        }
      );
    } else {
      this.showSearchResults = false;
      this.showNoResultsMessage = false;
      this.loadClient();
    }
  }

  paginate(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.orders.length);
    return this.orders.slice(startIndex, endIndex);
  }

  totalPage(): number {
    return Math.ceil(this.orders.length / this.itemsPerPage);
  }

  getPagesArray(): number[] {
    return Array(this.totalPage()).fill(0).map((x, i) => i + 1);
  }

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  calculateTotalOrderAmount() {
    if (this.orders && this.orders.length > 0) {
      this.totalOrderAmount = this.orders.reduce((total, order) => total + order.orderTotal, 0);
    } else {
      this.totalOrderAmount = 0; 
    }
  }
  
  getStatusText(status: number): string {
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

  sortOrders(): void {
    switch (this.sortBy) {
      case 'name':
        this.orders.sort((a, b) => (a.clientName > b.clientName ? 1 : -1));
        break;
      case 'date':
        this.orders.sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());
        break;
      case 'status':
        this.orders.sort((a, b) => a.orderStatus - b.orderStatus);
        break;
      case 'total':
        this.orders.sort((a, b) => a.orderTotal - b.orderTotal);
        break;
      default:
        break;
    }
  }
}
