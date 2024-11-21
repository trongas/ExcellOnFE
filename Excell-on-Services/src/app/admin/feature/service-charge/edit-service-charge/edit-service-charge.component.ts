import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ServiceChargeService } from 'src/app/admin/services/service-charge/service-charge.service';

@Component({
  selector: 'app-edit-service-charge',
  templateUrl: './edit-service-charge.component.html',
  styleUrls: ['./edit-service-charge.component.css']
})
export class EditServiceChargeComponent implements OnInit{
  updateForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditServiceChargeComponent>,
    private formBuilder: FormBuilder,
    private chargeService: ServiceChargeService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
      serviceChargesId: [this.data.serviceChargesId],
      serviceChargesName: [this.data?.serviceChargesName || '', Validators.required],
      price: [this.data?.price || '', Validators.required],
      serviceChargesDescription: [this.data?.serviceChargesDescription || '', Validators.required],
    });
  }


  onFormSubmit() {
    if (this.updateForm.valid) {
      if (this.data) {
        this.chargeService
          .updateService(this.data.serviceChargesId, this.updateForm.value)
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
