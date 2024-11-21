import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature/home/home.component';
import { ServicesPricingComponent } from './feature/services-pricing/services-pricing.component';
import { AboutComponent } from './feature/about/about.component';
import { PaymentsComponent } from './feature/payments/payments.component';
import { PaymentHistoryComponent } from './feature/payment-history/payment-history.component';
import { ReportsComponent } from './feature/reports/reports.component';
import { ProfileComponent } from './feature/profile/profile.component';
import { AuthClientGuard } from '../Guard/client.guard';

const routes: Routes = [
  {
    path: 'user',
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Home page' },
        pathMatch: 'full',
      },
      {
        path: 'services',
        component: ServicesPricingComponent,
        data: { title: 'Service-Pricing page' },
        pathMatch: 'full',
      },
      {
        path: 'about',
        component: AboutComponent,
        data: { title: 'About page' },
        pathMatch: 'full',
      },
      {
        path: 'payment',
        component: PaymentsComponent,canActivate: [AuthClientGuard] ,
        data: { title: 'Payment page' },
        pathMatch: 'full',
      },
      {
        path: 'paymentHistory',
        component: PaymentHistoryComponent,canActivate: [AuthClientGuard] ,
        data: { title: 'Pay History page' },
        pathMatch: 'full',
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: { title: 'Reports page' },canActivate: [AuthClientGuard] ,
        pathMatch: 'full',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Profile page' },canActivate: [AuthClientGuard] ,
        pathMatch: 'full',
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
export class ClientRoutingModule {}
