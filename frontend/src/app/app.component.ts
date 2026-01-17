import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { NotificationService } from './services/notification.service';
import { ProfileService } from './services/profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce-frontend';
  cartCount$: Observable<number>;
  unreadCount$: Observable<number>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private profileService: ProfileService
  ) {
    this.cartCount$ = this.cartService.getCartCount();
    this.unreadCount$ = this.notificationService.getUnreadCount();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get currentUser(): any {
    return this.authService.currentUserValue;
  }

  getProfilePicture(): string {
    const profile = this.profileService.getCurrentProfile();
    if (profile?.profilePicture) {
      return profile.profilePicture;
    }
    return 'https://via.placeholder.com/150';
  }

  get displayName(): string {
    const profile = this.profileService.getCurrentProfile();
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return this.currentUser?.username || 'User';
  }

  logout(): void {
    // Clear authentication data
    this.authService.logout();
    
    // Clear cart data
    this.cartService.clearCart();
    
    // Clear notifications
    this.notificationService.clearAll();
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  onProfileImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/150';
  }
}
