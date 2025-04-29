import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlogPost } from '../interfaces/BlogPost';

export interface Notification {
  id: number;
  message: string;
  postId: number;
  read: boolean;
  createdAt: Date;
  userName?: string;
  userAvatar?: string;
  title?: string;
  iduser?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);

  constructor() {
    
    this.loadNotificationsFromStorage();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount.asObservable();
  }

  addNotification(post: BlogPost): void {
    const userName = post.user ? `${post.user.firstName} ${post.user.lastName}` : 'Un utilisateur';
    
    const newNotification: Notification = {
      id: Date.now(),
      message: `${userName} a publié un nouveau post`,
      postId: post.postId,
      read: false,
      createdAt: new Date(),
      userName: userName,
      title: post.title,
      iduser: post.user.id
    };

    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = [newNotification, ...currentNotifications];
    
    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
    
 
    this.saveNotificationsToStorage(updatedNotifications);
    
   
    this.showBrowserNotification(newNotification);
  }

  markAsRead(notificationId: number): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
    

    this.saveNotificationsToStorage(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map(notification => {
      return { ...notification, read: true };
    });
    
    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
    
   
    this.saveNotificationsToStorage(updatedNotifications);
  }

  private updateUnreadCount(): void {
    const currentNotifications = this.notifications.getValue();
    const unreadCount = currentNotifications.filter(notification => !notification.read).length;
    this.unreadCount.next(unreadCount);
  }
  
  private saveNotificationsToStorage(notifications: Notification[]): void {
    const limitedNotifications = notifications.slice(0, 20);
    localStorage.setItem('blogNotifications', JSON.stringify(limitedNotifications));
  }
  
  private loadNotificationsFromStorage(): void {
    const storedNotifications = localStorage.getItem('blogNotifications');
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        const notificationsWithDateObjects = parsedNotifications.map((notification: any) => ({
          ...notification,
          createdAt: new Date(notification.createdAt)
        }));
        this.notifications.next(notificationsWithDateObjects);
        this.updateUnreadCount();
      } catch (error) {
        console.error('Erreur lors du chargement des notifications depuis le localStorage', error);
      }
    }
  }
  
  private showBrowserNotification(notification: Notification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Speakly Blog', {
        body: notification.message,
        icon: '/assets/img/logo.png'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }
}