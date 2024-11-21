import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromRoot from '../../../State/index';
import * as fromUser from '../../../State/client';
import { initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart/cart.service';
import { ServiceCharge } from 'src/app/interfaces/serviceCharge';
import { ProfileService } from '../../services/profile/profile.service';
import { ConfirmDialogComponent } from 'src/app/Shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  serviceCharges: { [clientId: number]: ServiceCharge[] } = {};
  token: string | null = localStorage.getItem('token');
  totalItems!: number;
  userProfile: any;
  isLoggedOut!: boolean;
  userEmail$: Observable<string> = new Observable();
  randomAvatarPath: string = '';
  userId: number | undefined;
  constructor(
    private store: Store<fromRoot.IAppState>,
    private router: Router,
    private toastr: ToastrService,
    private cartService: CartService,
    private profileService: ProfileService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    initFlowbite();
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      this.userEmail$ = new Observable((observer) => {
        observer.next(userEmail);
      });
    }
    this.store.select(fromUser.getIsLoggedOut).subscribe((isLoggedOut) => {
      this.isLoggedOut = isLoggedOut;
    });

    this.getItemLength();
    this.cartService.cartDetailTotal$.subscribe((total) => {
      this.totalItems = total;
    });
  }
  getItemLength() {
    if (this.token !== null) {
      this.profileService.GetProfileByJwt(this.token).subscribe(
        (response) => {
          this.userProfile = response.userProfile;
          // console.log(this.userProfile);
          // Check if userProfile is not null and has id property
          if (this.userProfile && this.userProfile.id) {
            this.userId = this.userProfile.id;
            // Check if userId is defined before calling getCart
            if (this.userId !== undefined) {
              this.getCart(this.userId);
            } else {
              console.error(
                'User ID is undefined. Handle this case appropriately.'
              );
            }
          } else {
            console.error(
              'User profile or user ID is missing. Handle this case appropriately.'
            );
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      console.error('Token is null. Handle this case appropriately.');
    }
  }
  getCart(clientId: number): void {
    // Check if service charges for this clientId already exist
    if (!this.serviceCharges[clientId]) {
      this.cartService.getCartByClientId(clientId).subscribe({
        next: (data) => {
          // Store service charges in an object using clientId as key
          this.serviceCharges[clientId] = data;
          this.totalItems = data.length;
        },
        error: (e) => console.error(e),
      });
    }
  }

  logout() {
    Swal.fire({
      width: 350,
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5D9C59',
      cancelButtonColor: '#FFC374',
      confirmButtonText: 'Yesss!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.toastr.success('Logout Successfully!', 'Success');
        this.store.dispatch(new fromUser.Logout());
        this.router.navigate(['/user/home']);
      }
    });
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 3; i++) {
      color += letters[Math.floor(Math.random() * 6)];
    }
    return color;
  }
}
