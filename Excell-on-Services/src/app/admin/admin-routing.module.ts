import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './feature/main/main.component';
import { CustomerManagementComponent } from './feature/customer-management/customer-management.component';
import { AuthAdminGuard } from '../Guard/admin.guard';
import { DepartmentComponent } from './feature/department/department.component';
import { EmployeeComponent } from './feature/employee/employee.component';
import { MessengerComponent } from './feature/messenger/messenger.component';
import { ProfileAdminComponent } from './feature/profile-admin/profile-admin.component';
import { PaymentsComponent } from './feature/payments/payments.component';
import { RoomDepartmentComponent } from './feature/department/room-department/room-department.component';
import { ServiceManagementComponent } from './feature/service-management/service-management.component';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'main',
        component: MainComponent,
        canActivate: [AuthAdminGuard],
        data: { title: 'Dashboard' },
      },
      {
        path: 'customer',
        component: CustomerManagementComponent,canActivate: [AuthAdminGuard],
        data: { title: 'Customer management' },
      },
      {
        path: 'department/room-department/:id',
        component: RoomDepartmentComponent,
        canActivate: [AuthAdminGuard],
        data: { title: 'Room Department' },
      },
      {
        path: 'department',
        component: DepartmentComponent,
        canActivate: [AuthAdminGuard],
        data: { title: 'Department' },
       
      },
      {
        path: 'employee',
        component: EmployeeComponent,
        canActivate: [AuthAdminGuard],
        data: { title: 'Employee' },
      },
      {
        path: 'services',
        component: ServiceManagementComponent,
        canActivate: [AuthAdminGuard],
        data: { title: 'Services' },
      },
      {
        path: 'messenger',
        component: MessengerComponent,
        canActivate: [AuthAdminGuard],
        data: { title: 'Messenger' },
      },
      {
        path: 'profile-admin',
        component: ProfileAdminComponent,
        canActivate: [AuthAdminGuard],
        data: { title: 'Profile Admin' },
      },
      {
        path: 'payments',
        component: PaymentsComponent,
        canActivate: [AuthAdminGuard],
        data: { title: 'Payment' },
      },
      {
        path: '**',
        redirectTo: '/error',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
