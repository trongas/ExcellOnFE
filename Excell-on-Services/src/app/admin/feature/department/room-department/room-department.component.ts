
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentDetailsComponent } from '../department-details/department-details.component';
import { Employee } from '../model/employee.model';
import { DepartmentService } from '../services/department.service';
@Component({
  selector: 'app-room-department',
  templateUrl: './room-department.component.html',
  styleUrls: ['./room-department.component.css'],
})
export class RoomDepartmentComponent implements OnInit {
  department: any[] = [];
  departmentId: any;
  departmentInfo: any = {};
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  departmentName: string | null = null; // Change type to string | null


  constructor(private route: ActivatedRoute, public dialog: MatDialog,private departmentService: DepartmentService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.departmentId = +params['id'];
      this.loadDepartmentInfo();  
      this.loadEmployees();
      // console.log(this.departmentId);
    });
    
  }
  
  showDepartmentDetail(id: number): void {
    this.departmentService.getEmployeeById(id).subscribe(
      (data) => {
        this.selectedEmployee = data;

        const dialogRef = this.dialog.open(DepartmentDetailsComponent, {
          width: '650px',
          data: { employee: data },
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed');
        });
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
  
  closeDepartmentDetail(): void {
    this.selectedEmployee = null;
  }

  editDepartment() {
  }

  loadDepartmentInfo() {
    this.departmentService.getDepartments().subscribe(
      (data) => {
        this.department = data;

        // Tìm tên phòng ban dựa trên departmentId
        const foundDepartment = this.department.find(
          (dept) => dept.id === this.departmentId
        );

        // Lưu tên phòng ban vào departmentName
        this.departmentName = foundDepartment ? foundDepartment.departmentName : null;
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }
  
  loadEmployees() {
    this.departmentService.getEmployeesByDepartmentId(this.departmentId).subscribe(
      (data) => {
        this.employees = data;
        console.log(this.employees); 
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }
  
  
  goBackToDepartment() {
    this.router.navigate(['/admin/department']);
  }
}
