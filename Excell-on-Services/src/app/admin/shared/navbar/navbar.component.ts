import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NavbarService } from './state/navbar.service';
import { Store } from '@ngrx/store';
import { NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NotificationService } from '../notification/notification.service';
import { Observable, filter } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


import * as fromRoot from '../../../State/index';
import * as fromAdmin from '../../../State/admin';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  pageTitleFromRoute: string = '';
  loggedInUser: any;
  showDropdown: boolean = false;
  [index: string]: any;
  showNotificationDropdown: boolean = false;
  isNotificationDropdownOpen: boolean = false;
  isMouseOverDropdown: boolean = false;
  notifications: { message: string; read: boolean; clicked: boolean }[] = [];
  unreadNotificationsCount: number = this.notifications.filter(notification => !notification.read).length;
  notificationsLoaded: boolean = false;
  isSidebarOpen = false;
  visibleNotificationsCount: number = 10;
  isLoggedOut!: boolean;
  reachedEndOfNotifications: boolean = false;

  userEmail$: Observable<string> = new Observable();



  constructor(private NavbarService: NavbarService,
    private toastr: ToastrService,
    private store: Store<fromRoot.IAppState>,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private notificationService: NotificationService,
    // private snackBar: MatSnackBar

  ) {

  }

  ngOnInit(): void {
    const token = localStorage.getItem('tokenAdmin');
    let loggedInUserId: string;

    if (token) {
      this.NavbarService.getLoggedInUser(token).subscribe(
        (employeeData) => {
          loggedInUserId = this.getLoggedInUserIdFromToken(token);
          this.loggedInUser = employeeData.find((employee: any) => employee.email === loggedInUserId);

          loggedInUserId = this.loggedInUser.id;
          // Đặt giá trị của trường id trong FormGroup
        },
        (error) => {
          console.error('Error fetching employee data:', error);
        }
      );
    } else {
      console.error('Token is null or undefined');
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setPageTitleFromRoute();
      });

    this.userEmail$ = this.store.select(fromAdmin.getAdminEmail);
    this.store.select(fromAdmin.getAdminIsLoggedOut).subscribe((isLoggedOut) => {
      this.isLoggedOut = isLoggedOut;
    });

    this.notificationService.notifications$.subscribe((notification: { message: string; read: boolean; }) => {
      this.notifications.unshift({ ...notification, clicked: false });

      // Cập nhật số thông báo chưa đọc
      this.unreadNotificationsCount++;
    });

    // Khôi phục thông báo từ localStorage khi component được khởi tạo
    this.restoreNotifications();


  }

  onScroll() {
    // Kiểm tra xem có còn thông báo chưa hiển thị hay không
    const dropdownElement = document.querySelector('.notification-dropdown');
    if (dropdownElement) {
      dropdownElement.addEventListener('scroll', () => {
        // Chiều cao hiển thị của dropdown
        const visibleHeight = dropdownElement.clientHeight;
    
        // Vị trí cuộn hiện tại trong dropdown
        const scrollPosition = dropdownElement.scrollTop;
    
        // Chiều cao thực tế của dropdown
        const totalHeight = dropdownElement.scrollHeight;
    
        // Khoảng cách từ vị trí cuộn tới dưới cùng của dropdown
        const distanceToBottom = totalHeight - (scrollPosition + visibleHeight);
    
        const scrolledNearBottom = distanceToBottom < (400 / 400);
    
        if (scrolledNearBottom) {
          // Thực hiện hành động khi cuộn gần dưới cùng của dropdown
          // Ví dụ: Hiển thị thêm thông báo
          const remainingNotifications = this.notifications.length - this['visibleNotificationsCount'];
    
          if (remainingNotifications > 0) {
            const newVisibleCount = Math.min(5, remainingNotifications);
            this['visibleNotificationsCount'] += newVisibleCount;
          }
        }
      });
    }
  }


  private restoreNotifications() {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]') as {
      message: string;
      read: boolean;
    }[];
    storedNotifications.forEach(notification => this.notifications.push({ ...notification, clicked: false }));
  }

  handleNotificationClick(index: number) {
    // Đảo ngược trạng thái clicked của thông báo tại index
    this.notifications[index].clicked = !this.notifications[index].clicked;
  }


  addNotification(notification: any) {
    this.notifications.unshift(notification); // Thêm vào đầu mảng để hiển thị thông báo mới nhất trước
    this.unreadNotificationsCount++; // Tăng số thông báo chưa đọc
  }

  // Hàm để đánh dấu một thông báo là đã đọc
  markAsRead(index: number) {
    if (!this.notifications[index].read) {
      this.notifications[index].read = true; // Đánh dấu là đã đọc
      this.unreadNotificationsCount--; // Giảm số thông báo chưa đọc
    }
  }

  // Hàm để xóa một thông báo
  deleteNotification(index: number) {
    const deletedNotification = this.notifications[index];
    this.notificationService.deleteNotification(deletedNotification);

    // Cập nhật danh sách hiển thị ngay sau khi xóa thông báo
    this.notifications.splice(index, 1);
    this.unreadNotificationsCount--; // Giảm số thông báo chưa đọc khi xóa
  }
  showNotifications() {
    this.showNotificationDropdown = !this.showNotificationDropdown;
    if (this.showNotificationDropdown) {
      this.unreadNotificationsCount = 0; // Đánh dấu tất cả là đã đọc khi hiển thị dropdown
    }
  }


  // // Hàm để chuyển đổi trạng thái mở/đóng thanh điều hướng
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  getLoggedInUserIdFromToken(token: string): string {
    const decodedToken = this.decodeJwtToken(token);

    // Trích xuất ID của người đăng nhập từ decoded token
    const loggedInUserId = decodedToken && decodedToken.sub ? decodedToken.sub : null;

    return loggedInUserId;
  }

  decodeJwtToken(token: string): any {
    // Đây là một hàm giả để giải mã token JWT, bạn có thể sử dụng một thư viện thực tế
    // Ví dụ: https://www.npmjs.com/package/jsonwebtoken
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
  }

  private setPageTitleFromRoute(): void {
    // Get the current route
    const currentRoute = this['route'].root;

    // Traverse the route tree to find the last activated route
    let lastActivatedRoute = currentRoute;
    while (lastActivatedRoute.firstChild) {
      lastActivatedRoute = lastActivatedRoute.firstChild;
    }

    // Extract the title from the route data
    this.pageTitleFromRoute =
      lastActivatedRoute.snapshot.data['title'] || 'Default Title';
  }



}
