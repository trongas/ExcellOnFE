import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { RoomDepartmentComponent } from './room-department/room-department.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DepartmentDetailsComponent } from './department-details/department-details.component';
import { CreateDepartmentComponent } from './create-department/create-department.component';
import { EditDepartmentComponent } from './edit-department/edit-department.component';


@NgModule({
  schemas: [NO_ERRORS_SCHEMA],

  declarations: [
    DepartmentDetailsComponent,
    CreateDepartmentComponent,
    RoomDepartmentComponent,
    EditDepartmentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    NgxPaginationModule,
    MatDialogModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },  // Provide MAT_DIALOG_DATA
  ],
})
export class DepartmentModule { }
