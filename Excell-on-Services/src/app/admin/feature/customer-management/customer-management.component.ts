import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Customer } from 'src/app/interfaces/customer';
import { CustomerService } from '../../services/customer/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    CommonModule,
  ],
  providers: [DatePipe],
})
export class CustomerManagementComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'dob',
    'email',
    'phone',
    'actions',
  ];
  dataSource: MatTableDataSource<Customer>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.dataSource = new MatTableDataSource<Customer>();
  }

  ngOnInit(): void {
    this.getCustomerList();
  }
  getCustomerList() {
    this.customerService.getAllCustomer().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openEditForm(customer: any): void {
    const dialogRef = this.dialog.open(EditCustomerComponent, {
      width: '700px',
      data: customer,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCustomerList();
    });
  }

  deleteCustomer(id: number): void {
    Swal.fire({
      width: 350,
      title: 'Delete',
      text: 'Are you sure you want to delete this customer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#FFC374',
      confirmButtonText: 'Delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteCustomer(id).subscribe(() => {
          this.getCustomerList();
          this.toastr.success('Delete successful!', 'Success');
        });
      }
    });
  }
}
