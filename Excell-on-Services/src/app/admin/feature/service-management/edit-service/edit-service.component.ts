import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ServiceManagementService } from 'src/app/admin/services/service-management/service-management.service';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.css']
})
export class EditServiceComponent implements OnInit {
  updateForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditServiceComponent>,
    private formBuilder: FormBuilder,
    private serviceManagementService: ServiceManagementService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
      serviceId: [this.data?.serviceId],
      serviceName: [this.data?.serviceName || '', Validators.required],
      description: [this.data?.description || '', Validators.required],
     
    });
  }

  onFormSubmit() {
    if (this.updateForm.valid) {
      if (this.data) {
        this.serviceManagementService
          .updateService(this.data.serviceId, this.updateForm.value)
          .subscribe({
            next: (val: any) => {
              
              this.toastr.success('Update successful!', 'Success');
              this.dialogRef.close(true);
             
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      }
    }
  }
}
