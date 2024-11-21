import { CUSTOM_ELEMENTS_SCHEMA, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './State';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './Effects';
import { ErrorPageComponent } from './Shared/error-page/error-page.component';
import { ChatBoxComponent } from './Shared/chat-box/chat-box.component';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ConfirmDialogComponent } from './Shared/confirm-dialog/confirm-dialog.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    ErrorPageComponent,
    ChatBoxComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AdminModule,
    ClientModule,
    AuthModule,
    MatPaginatorModule,
    FormsModule,

    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeOut: 2000,
      closeButton: true,
      progressBar: true,
    }),
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot(AppEffects),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }
