// notification.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private notificationsSubject = new Subject<{ message: string; read: boolean }>();
    public notifications$ = this.notificationsSubject.asObservable();

    constructor() {
        // Khôi phục thông báo từ localStorage khi service được khởi tạo
        const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]') as { message: string; read: boolean }[];
        storedNotifications.forEach(notification => this.notificationsSubject.next(notification));
    }

    public saveNotificationsToLocalStorage(notifications: { message: string; read: boolean }[]) {
        // Lưu thông báo vào localStorage
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    deleteNotification(deletedNotification: { message: string; read: boolean }) {
        const currentNotifications = JSON.parse(localStorage.getItem('notifications') || '[]') as {
            message: string;
            read: boolean;
        }[];
    
        const index = currentNotifications.findIndex(
            n => n.message === deletedNotification.message && n.read === deletedNotification.read
        );
        if (index !== -1) {
            const deletedNotificationObj = currentNotifications[index];
            currentNotifications.splice(index, 1);
            this.saveNotificationsToLocalStorage(currentNotifications);
    
            // Gửi đối tượng thông báo thay vì mảng
            this.notificationsSubject.next(deletedNotificationObj);
        }
    }

    notifyUpdateEmployee(employeeName: string) {
        const notificationMessage = `Bạn đã cập nhật thông tin nhân viên ${employeeName}`;
        const notification: { message: string; read: boolean } = { message: notificationMessage, read: false };
        this.notificationsSubject.next(notification);

        // Lấy thông báo hiện tại từ localStorage
        const currentNotifications = JSON.parse(localStorage.getItem('notifications') || '[]') as {
            message: string;
            read: boolean;
        }[];
        

        // Thêm thông báo mới vào mảng
        currentNotifications.unshift(notification);

        // Lưu lại vào localStorage
        this.saveNotificationsToLocalStorage(currentNotifications);
    }

    notifyDeleteEmployee(employeeName: string) {
        const notificationMessage = `Bạn đã xóa thông tin nhân viên ${employeeName}`;
        const notification: { message: string; read: boolean } = { message: notificationMessage, read: false };
        this.notificationsSubject.next(notification);

        // Lấy thông báo hiện tại từ localStorage
        const currentNotifications = JSON.parse(localStorage.getItem('notifications') || '[]') as {
            message: string;
            read: boolean;
        }[];

        // Thêm thông báo mới vào mảng
        currentNotifications.unshift(notification);

        // Lưu lại vào localStorage
        this.saveNotificationsToLocalStorage(currentNotifications);
    }

    notifyCreateEmployee(employeeName: string) {
        const notificationMessage = `Bạn đã tạo nhân viên ${employeeName}`;
        const notification: { message: string; read: boolean } = { message: notificationMessage, read: false };
        this.notificationsSubject.next(notification);

        // Lấy thông báo hiện tại từ localStorage
        const currentNotifications = JSON.parse(localStorage.getItem('notifications') || '[]') as {
            message: string;
            read: boolean;
        }[];

        // Thêm thông báo mới vào mảng
        currentNotifications.unshift(notification);

        // Lưu lại vào localStorage
        this.saveNotificationsToLocalStorage(currentNotifications);
    }

    notifyUpdateProfile() {
        const notificationMessage = `Bạn đã sửa thông tin của mình`;
        const notification: { message: string; read: boolean } = { message: notificationMessage, read: false };
        this.notificationsSubject.next(notification);

        // Lấy thông báo hiện tại từ localStorage
        const currentNotifications = JSON.parse(localStorage.getItem('notifications') || '[]') as {
            message: string;
            read: boolean;
        }[];

        // Thêm thông báo mới vào mảng
        currentNotifications.unshift(notification);

        // Lưu lại vào localStorage
        this.saveNotificationsToLocalStorage(currentNotifications);
    }
}
