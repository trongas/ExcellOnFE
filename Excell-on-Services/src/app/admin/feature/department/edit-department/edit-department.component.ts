import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateDepartmentDto } from './update-department.dto';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css'],
})
export class EditDepartmentComponent {
  departmentForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.initializeForm();
  }

  initializeForm() {
    const { id, departmentName, departmentDescription } = this.data.department;

    this.departmentForm = this.formBuilder.group({
      id: [id, Validators.required],
      departmentName: [departmentName, Validators.required],
      departmentDescription: [departmentDescription, Validators.required],
    });
    console.log()
  }
  
  saveChanges() {
    if (this.departmentForm.valid) {
      const updatedDepartment: UpdateDepartmentDto = this.departmentForm.value;

      this.dialogRef.close(updatedDepartment);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
