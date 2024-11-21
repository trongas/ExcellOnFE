import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './feature/home/home.component';
import { AboutComponent } from './feature/about/about.component';
import { ProfileComponent } from './feature/profile/profile.component';
import { ReportsComponent } from './feature/reports/reports.component';
import { ServicesPricingComponent } from './feature/services-pricing/services-pricing.component';
import { PaymentHistoryComponent } from './feature/payment-history/payment-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientRoutingModule } from './client-routing.module';
import { ServiceDetailComponent } from './feature/service-detail/service-detail.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PaymentsComponent } from './feature/payments/payments.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EditProfileComponent } from './feature/profile/edit-profile/edit-profile.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    ProfileComponent,
    ReportsComponent,
    ServicesPricingComponent,
    PaymentHistoryComponent,
    ServiceDetailComponent,
    PaymentsComponent,
    EditProfileComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
  ],
  exports: [HeaderComponent, FooterComponent],
})
export class ClientModule {}
