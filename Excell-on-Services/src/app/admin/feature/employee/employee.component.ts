import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from './state/employee.service';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../shared/notification/notification.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from 'src/app/interfaces/employee';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { Customer } from 'src/app/interfaces/customer';
import { CustomerService } from '../../services/customer/customer.service';
import { DepartmentService } from '../department/services/department.service';
import { Department } from 'src/app/interfaces/department';





@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
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
  providers: [DatePipe]
})


export class EmployeeComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'avatar',
    'fullName',
    'dob',
    'email',
    'phone',
    'department',
    'actions',
  ];
  dataSource: MatTableDataSource<Employee>;
  departments: Department[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private departmentService: DepartmentService,
  ) {
    this.dataSource = new MatTableDataSource<Employee>();
  }

  ngOnInit(): void {
    this.getEmployeeList();
    this.getDepartments();
  }
  getEmployeeList() {
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  getDepartmentName(departmentId: number): string {
    // Tìm tên phòng ban tương ứng với departmentId
    const department = this.departments.find(dep => dep.id === departmentId);
    return department ? department.departmentName : '';
  }
  
  getDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments: Department[]) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error fetching departments:', error);
      }
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
    const dialogRef = this.dialog.open(EditEmployeeComponent, {
      width: '700px',
      data: customer,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getEmployeeList();
    });
  }

  deleteCustomer(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this customer?',
        yesText: 'Delete',
        noText: 'Cancel',
        isCritical: true,
        icon: '<i class="fa-solid fa-circle-exclamation text-[48px]"></i>',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeService.deleteEmployee(id).subscribe(() => {
          this.getEmployeeList();
          this.toastr.success('Delete successful!', 'Success');
        });
      }
    });
  }

  createEmployee() {
    const dialogRef = this.dialog.open(CreateEmployeeComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getEmployeeList();
    });
  }

}
