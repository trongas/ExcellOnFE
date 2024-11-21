import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateDepartmentDto } from './create-department.dto'; 

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.css']
})
export class CreateDepartmentComponent implements OnInit {
  departmentForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CreateDepartmentComponent>) {
    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required],
      departmentDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  saveDepartment() {
    this.dialogRef.close(this.departmentForm.value as CreateDepartmentDto);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
