import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ServiceManagementService } from 'src/app/admin/services/service-management/service-management.service';
import { Service } from 'src/app/interfaces/service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css'],
})
export class AddServiceComponent {
  newService: Service = {
    serviceId: 0,
    serviceName: '',
    description: '',
  };

  constructor(
    private serviceManagementService: ServiceManagementService,
    public dialogRef: MatDialogRef<AddServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService
  ) {}

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

  onCancel(): void {
    this.dialogRef.close();
  }
}
