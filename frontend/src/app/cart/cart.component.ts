import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ImageUtils } from '../utils/image.utils';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice = 0;
  isLoading = false;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.updateTotalPrice();
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  getDefaultImage(productName: string): string {
    return ImageUtils.getDefaultProductImage(productName);
  }

  onImageError(event: any): void {
    ImageUtils.onProductImageError(event);
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.snackBar.open('Item removed from cart', 'Close', {
      duration: 3000
    });
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.snackBar.open('Cart cleared', 'Close', {
      duration: 3000
    });
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      this.snackBar.open('Your cart is empty', 'Close', {
        duration: 3000
      });
      return;
    }

    // Navigate to checkout page
    this.router.navigate(['/checkout']);
  }

  private updateTotalPrice(): void {
    this.totalPrice = this.cartService.getTotalPrice();
  }
}
