import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notifications.asObservable();

  constructor() {
    // Initialize with some default notifications
    const sampleNotifications: Notification[] = [
      {
        id: this.generateId(),
        title: 'Welcome to E-Commerce Store!',
        message: 'Thank you for joining our platform. Start exploring our amazing products.',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: false
      },
      {
        id: this.generateId(),
        title: 'New Product Alert',
        message: 'Check out our latest Laptop Pro with amazing features!',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        read: false
      },
      {
        id: this.generateId(),
        title: 'Order Confirmed',
        message: 'Your order #12345 has been confirmed and is being processed.',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true
      },
      {
        id: this.generateId(),
        title: 'Special Offer',
        message: 'Get 20% off on all electronics this weekend!',
        type: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true
      },
      {
        id: this.generateId(),
        title: 'Payment Successful',
        message: 'Your payment for order #12344 has been processed successfully.',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true
      }
    ];
    
    this.notifications.next(sampleNotifications);
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };
    
    const currentNotifications = this.notifications.value;
    this.notifications.next([newNotification, ...currentNotifications]);
  }

  markAsRead(notificationId: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    this.notifications.next(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      read: true
    }));
    this.notifications.next(updatedNotifications);
  }

  removeNotification(notificationId: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== notificationId
    );
    this.notifications.next(updatedNotifications);
  }

  clearAll(): void {
    this.notifications.next([]);
  }

  getUnreadCount(): Observable<number> {
    return this.notifications$.pipe(
      map((notifications: Notification[]) => 
        notifications.filter((notification: Notification) => !notification.read).length
      )
    );
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
