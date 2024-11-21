import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/client/services/profile/profile.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  updateForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>,
    private formBuilder: FormBuilder,
    private customerService: ProfileService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
      clientId: [this.data.id],
      firstName: [this.data?.firstName || '', Validators.required],
      lastName: [this.data?.lastName || '', Validators.required],
      dob: [this.data?.dob || '', [Validators.required, this.validateDOB]],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      phone: [
        this.data?.phone || '',
        [Validators.required, this.validatePhone],
      ],
    });
  }
  validateDOB(control: any) {
    const birthDate = new Date(control.value);
    const ageDifferenceMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifferenceMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (age < 18) {
      return { underage: true };
    }
    return null;
  }

  validatePhone(control: any) {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(control.value)) {
      return { invalidPhone: true };
    }
    return null;
  }

  onFormSubmit() {
    if (this.updateForm.valid) {
      if (this.data) {
        this.customerService
          .updateProfile(this.data.id, this.updateForm.value)
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
