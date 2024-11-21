import { RouterModule, Routes } from "@angular/router";
import { DepartmentComponent } from "./department.component";
import { RoomDepartmentComponent } from "./room-department/room-department.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  
    { path: 'department/room-department', component: RoomDepartmentComponent },

  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DepartmentRoutingModule { }

