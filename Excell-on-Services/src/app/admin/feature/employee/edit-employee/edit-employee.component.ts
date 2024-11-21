// edit-employee.component.ts

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Inject } from '@angular/core';
import { EmployeeService } from '../state/employee.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService  } from '../../../shared/notification/notification.service';



@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  @ViewChild('loadingSpinner') loadingSpinner: ElementRef | undefined;
  empForm!: FormGroup;
  formErrors: any = {};
  updating: boolean = false;



  constructor(
    public dialogRef: MatDialogRef<EditEmployeeComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    console.log('Department from data:', this.data);

    this.empForm = this.formBuilder.group({
      id: [this.data.id],
      firstName: [this.data?.firstName || '', Validators.required],
      lastName: [this.data?.lastName || '', Validators.required],
      dob: [this.data?.dob || '', [Validators.required, this.ageValidator]],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      phone: [this.data?.phone || '', [Validators.required, this.phoneValidator]],
      departmentId: [parseInt(this.data?.departmentId) || null, Validators.required],
      avatar: [this.data?.avatar?.url || '', Validators.required],
      // Thêm các trường khác của form vào đây
    });
    this.empForm.valueChanges.subscribe(() => {
      // Kiểm tra lỗi và cập nhật formErrors ngay khi có sự thay đổi
      this.formErrors = this.getFormValidationErrors();
    });
  }
  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.empForm.patchValue({
        avatar: file,
      });
    }
  }

  onSave(): void {
    if (this.empForm.valid) {
      this.updating = true;
      const updatedEmployee = this.empForm.value;

      // Tạo đối tượng FormData và thêm các trường cần thiết
      const formData = new FormData();
      formData.append('Id', updatedEmployee.id);
      formData.append('FirstName', updatedEmployee.firstName);
      formData.append('LastName', updatedEmployee.lastName);
      formData.append('Dob', updatedEmployee.dob);
      formData.append('Email', updatedEmployee.email);
      formData.append('Phone', updatedEmployee.phone);
      formData.append('DepartmentId', updatedEmployee.departmentId);
      formData.append('Avatar', updatedEmployee.avatar);

      this.employeeService.updateEmployee(formData).subscribe(
        (response) => {
          // Xử lý thành công, ví dụ: đóng hộp thoại
          this.toastr.success('Update successful!', 'Success');
          this.dialogRef.close(); // Đóng dialog khi cập nhật thành công
          this.notificationService.notifyUpdateEmployee(updatedEmployee.firstName);
        },
        (error) => {
          // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
          console.error('Lỗi khi cập nhật nhân viên:', error);
          this.toastr.error('Update failed!', 'Error'); // Thêm thông báo lỗi
        }
      ).add(() => {
        // Kết thúc quá trình cập nhật (thành công hoặc thất bại)
        this.updating = false; // Dừng hiển thị loading
      });
    } else {
      this.toastr.error('Update failed!', 'Error');
    }
  }

  onClose(): void {
    this.toastr.warning('Update cancel!', 'Warning');
  }

  getFormValidationErrors(): any[] {
    const errors: any[] = [];

    Object.keys(this.empForm.controls).forEach((key: string) => {
      const controlErrors = this.empForm.get(key)?.errors;
      if (controlErrors != null) {
        errors.push({
          field: key,
          messages: Object.keys(controlErrors).map((keyError: string) => {
            if (keyError === 'underage') {
              return `Age must be at least 18 years old!`;
            } else if (keyError === 'email') {
              return `Email must be a valid email address.`; // Thêm thông báo lỗi cho email không đúng định dạng
            } else if (keyError === 'invalidPhone') {
              return `Phone must have exactly 10 numbers.`; 
            }
            // Thêm các trường hợp lỗi khác nếu cần
            return ''; // Trường hợp mặc định, có thể là chuỗi trống hoặc một thông báo khác
        }),
        
        });
      }
    });

    console.log(errors); // Kiểm tra lỗi ở đây
    return errors;
  }

  phoneValidator(control: any): { [key: string]: boolean } | null {
    const phoneNumber = control.value;
  
    // Kiểm tra số điện thoại có đúng 10 kí tự không
    if (phoneNumber && phoneNumber.length === 10) {
      return null; // Số điện thoại hợp lệ
    } else {
      return { 'invalidPhone': true }; // Số điện thoại không hợp lệ
    }
  }

  ageValidator(control: any): { [key: string]: boolean } | null {
    const birthDate = new Date(control.value);
    const currentDate = new Date();
    const ageInMilliseconds = currentDate.getTime() - birthDate.getTime();
    const ageInYears = ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000);

    if (ageInYears < 18) {
      return { 'underage': true };
    }

    return null; // Thêm dòng này để đảm bảo rằng luôn có giá trị được trả về
  }

}
