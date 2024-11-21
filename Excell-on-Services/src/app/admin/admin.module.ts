import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { DepartmentComponent } from './feature/department/department.component';
import { EmployeeComponent } from './feature/employee/employee.component';
import {  MessengerComponent } from './feature/messenger/messenger.component';
import { ProfileAdminComponent } from './feature/profile-admin/profile-admin.component';
import { CreateEmployeeComponent } from './feature/employee/create-employee/create-employee.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { EditEmployeeComponent } from './feature/employee/edit-employee/edit-employee.component';
import { PaymentsComponent } from './feature/payments/payments.component';
import { DepartmentModule } from './feature/department/department.module';
import { EditCustomerComponent } from './feature/customer-management/edit-customer/edit-customer.component';
import { EditServiceComponent } from './feature/service-management/edit-service/edit-service.component';
import { AddServiceComponent } from './feature/service-management/add-service/add-service.component';
import { MainComponent } from './feature/main/main.component';
import { ServiceChargeComponent } from './feature/service-charge/service-charge.component';
import { AddServiceChargeComponent } from './feature/service-charge/add-service-charge/add-service-charge/add-service-charge.component';
import { EditServiceChargeComponent } from './feature/service-charge/edit-service-charge/edit-service-charge.component';
import { EmployeeModule } from './feature/employee/employee.module';
// import { MainModule } from './feature/main/main.module';


@NgModule({
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    SidebarComponent,
    NavbarComponent,
    DepartmentComponent,
    MessengerComponent,
    ProfileAdminComponent,
    CreateEmployeeComponent,
    EditEmployeeComponent,
    PaymentsComponent,
    EditCustomerComponent,
    EditServiceComponent,
    AddServiceComponent,  
    MainComponent, AddServiceChargeComponent, EditServiceChargeComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    DepartmentModule,
    EmployeeModule
    
    // MainModule
  ],
  exports:[
    SidebarComponent,
    NavbarComponent,
  ]
})
export class AdminModule { }
