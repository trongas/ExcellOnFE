import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule và ReactiveFormsModule
import { NgxPaginationModule } from 'ngx-pagination';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Thêm ReactiveFormsModule vào imports
    NgxPaginationModule,
    MatPaginatorModule,
    MatTableModule,
    
  ]
})
export class EmployeeModule { }
