import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminService } from './services/admin.service';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    LoginComponent,
    RegisterComponent,
    AdminLoginComponent,
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    HttpClientModule,
    StoreModule,
    EffectsModule,
    ReactiveFormsModule,
    FormsModule,
    
  ],
  providers: [AdminService],
  bootstrap: []
})
export class AuthModule { }
