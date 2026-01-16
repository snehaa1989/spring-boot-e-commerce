import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  constructor() {
    this.loadNotificationsFromStorage();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  addNotification(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    const notification: Notification = {
      id: this.generateId(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(notification);
    this.updateNotifications();
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.updateNotifications();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.updateNotifications();
  }

  removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.updateNotifications();
  }

  clearAll(): void {
    this.notifications = [];
    this.updateNotifications();
  }

  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  private updateNotifications(): void {
    this.notificationsSubject.next([...this.notifications]);
    this.unreadCountSubject.next(this.getUnreadNotifications().length);
    this.saveNotificationsToStorage();
  }

  private saveNotificationsToStorage(): void {
    // Only save last 50 notifications to prevent storage overflow
    const notificationsToSave = this.notifications.slice(0, 50);
    localStorage.setItem('notifications', JSON.stringify(notificationsToSave));
  }

  private loadNotificationsFromStorage(): void {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        this.notifications = JSON.parse(savedNotifications);
        // Convert timestamp strings back to Date objects
        this.notifications.forEach(notification => {
          notification.timestamp = new Date(notification.timestamp);
        });
        this.updateNotifications();
      } catch (error) {
        console.error('Error loading notifications from storage:', error);
        this.notifications = [];
      }
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
