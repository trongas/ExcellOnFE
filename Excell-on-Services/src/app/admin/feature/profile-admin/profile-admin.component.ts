import { Component, OnInit } from '@angular/core';
import { ProfileAdminService } from './service/profile-admin.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Token } from '@angular/compiler';
import { NotificationService  } from '../../shared/notification/notification.service';


@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.css']
})
export class ProfileAdminComponent implements OnInit {
  loggedInUser: any;
  employee: any[] = [];
  showOptions = false;
  editedUser: any;
  isEditing: boolean = false;
  selectedFile: File | null = null;
  empForm!: FormGroup;
  updating: boolean = false;


  constructor(private profileAdmin: ProfileAdminService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    const token = localStorage.getItem('tokenAdmin');
    let loggedInUserId: string;

    if (token) {
      this.profileAdmin.getLoggedInUser(token).subscribe(
        (employeeData) => {
          loggedInUserId = this.getLoggedInUserIdFromToken(token);
          this.loggedInUser = employeeData.find((employee: any) => employee.email === loggedInUserId);

          loggedInUserId = this.loggedInUser.id;

          // Đặt giá trị của trường id trong FormGroup
          this.empForm.get('id')?.setValue(loggedInUserId);
        },
        (error) => {
          console.error('Error fetching employee data:', error);
        }
      );
    } else {
      console.error('Token is null or undefined');
    }
    // Kiểm tra xem dữ liệu có sẵn trước khi khởi tạo form
    if (this.data) {
      this.empForm = this.formBuilder.group({
        id: [this.data.id],
        firstName: [this.data?.firstName || '', Validators.required],
        lastName: [this.data?.lastName || '', Validators.required],
        dob: [this.data?.dob || '', Validators.required],
        email: [this.data?.email || '', [Validators.required, Validators.email]],
        phone: [this.data?.phone || '', Validators.required],
        departmentId: [parseInt(this.data?.departmentId) || null, Validators.required],
        avatar: [this.data?.avatar?.url || '', Validators.required],
        // Thêm các trường khác của form vào đây
      });
    } else {
      console.error('Data is null or undefined');
      // Xử lý trường hợp khi dữ liệu không có sẵn, ví dụ như đóng dialog hoặc hiển thị thông báo lỗi
    }
  }


  startEditing() {
    this.isEditing = true;
    // Clone the loggedInUser to avoid directly modifying it
    this.editedUser = { ...this.loggedInUser };
  }

  saveChanges() {
    if (this.isEditing) {
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

        this.profileAdmin.updateEmployee(formData).subscribe(
          (response) => {
            // Xử lý thành công, ví dụ: đóng hộp thoại
            this.toastr.success('Update successful!', 'Success');
            this.loadEmployee();
          this.notificationService.notifyUpdateProfile();
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
  }

  private loadEmployee(): void {
    const token = localStorage.getItem('tokenAdmin');

    if (token !== null) {
      this.profileAdmin.getLoggedInUser(token).subscribe(
        (data) => {
          this.employee = data;
        },
        (error) => {
          console.error('Error fetching employee data:', error);
          // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
        }
      );
    } else {
      console.error('Token is null or undefined');
      // Xử lý trường hợp khi token là null hoặc không xác định, ví dụ: hiển thị thông báo lỗi
    }
  }

  onFileSelected(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.empForm.patchValue({
        avatar: file,
      });
    }
  }

  cancelEditing() {
    this.isEditing = false;
    // Reset editedUser to avoid saving changes
    this.editedUser = null;
    this.toastr.warning('Update cancel!', 'Warning');
  }

  getLoggedInUserIdFromToken(token: string): string {
    const decodedToken = this.decodeJwtToken(token);

    // Trích xuất ID của người đăng nhập từ decoded token
    const loggedInUserId = decodedToken && decodedToken.sub ? decodedToken.sub : null;

    return loggedInUserId;
  }

  decodeJwtToken(token: string): any {
    // Đây là một hàm giả để giải mã token JWT, bạn có thể sử dụng một thư viện thực tế
    // Ví dụ: https://www.npmjs.com/package/jsonwebtoken
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }
}
