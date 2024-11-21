import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Service } from 'src/app/interfaces/service';
import { ServiceManagementService } from '../../services/service-management/service-management.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { ServiceChargeComponent } from '../service-charge/service-charge.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-management',
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
  ],
})
export class ServiceManagementComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'serviceName',
    'description',
    // 'totalDay',
    'actions',
  ];
  dataSource: MatTableDataSource<Service>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private serviceManagementService: ServiceManagementService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.dataSource = new MatTableDataSource<Service>();
  }

  ngOnInit(): void {
    this.getServiceList();
  }
  getServiceList() {
    this.serviceManagementService.getAllService().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.table(res);
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

  openEditForm(service: any): void {
    const dialogRef = this.dialog.open(EditServiceComponent, {
      width: '700px',
      data: service,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getServiceList();
    });
  }
  createService() {
    const dialogRef = this.dialog.open(AddServiceComponent, {
      width: '700px',
      height: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getServiceList();
    });
  }

  openServiceChargeDialog(id: number, serviceName: string): void {
    const dialogRef = this.dialog.open(ServiceChargeComponent, {
      width: '960px',
      height: '550px',
      data: { serviceId: id, serviceName: serviceName },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  deleteService(id: number): void {
    Swal.fire({
      width: 350,
      title: 'Delete',
      text: 'Are you sure you want to delete this service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#FFC374',
      confirmButtonText: 'Delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceManagementService.deleteService(id).subscribe(() => {
          this.getServiceList();
          this.toastr.success('Delete successful!', 'Success');
        });
      }
    });
  }
}
