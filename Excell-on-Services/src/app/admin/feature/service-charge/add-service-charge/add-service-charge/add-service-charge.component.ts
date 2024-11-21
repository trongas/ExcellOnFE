import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ServiceChargeService } from 'src/app/admin/services/service-charge/service-charge.service';
import { ServiceCharge } from 'src/app/interfaces/serviceCharge';

@Component({
  selector: 'app-add-service-charge',
  templateUrl: './add-service-charge.component.html',
  styleUrls: ['./add-service-charge.component.css']
})
export class AddServiceChargeComponent implements OnInit{
  @Input() data!: number;

  newService: ServiceCharge = {
    serviceId: 0,
    serviceChargesDescription: '',
    serviceChargesName: '',
    price:0,
    serviceChargeId: 0,
    cartId: 0,
  };

  constructor(
    private serviceManagementService: ServiceChargeService,
    public dialogRef: MatDialogRef<AddServiceChargeComponent>,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.newService.serviceId = this.data; 
  }
  onSave(): void {
    this.serviceManagementService.addService(this.newService).subscribe(
      (res) => {
        this.toastr.success('Service added successfully!', 'Success');
        this.dialogRef.close(res);
      },
      (error) => {
        console.error(error);
        this.toastr.error('Failed to add service', 'Error');
      }
    );
  }

}
