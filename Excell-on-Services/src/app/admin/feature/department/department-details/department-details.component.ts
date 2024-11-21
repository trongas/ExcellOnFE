import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Employee } from '../model/employee.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.css']
})
export class DepartmentDetailsComponent {
  employee: Employee | null;

  constructor(private router : Router ,@Inject(MAT_DIALOG_DATA) public data: { employee: Employee }) {
    // Ensure that the employee object is defined before accessing its properties
    this.employee = data ? data.employee : null;
  }
  goBackToDepartment() {
    this.router.navigate(['/admin/department/room-department']);
  }
  
}
