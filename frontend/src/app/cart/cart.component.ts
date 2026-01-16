import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice = 0;
  isLoading = false;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
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

    this.isLoading = true;
    // TODO: Implement checkout logic
    setTimeout(() => {
      this.isLoading = false;
      this.snackBar.open('Order placed successfully!', 'Close', {
        duration: 3000
      });
      this.clearCart();
    }, 2000);
  }

  private updateTotalPrice(): void {
    this.totalPrice = this.cartService.getTotalPrice();
  }

  getDefaultImage(productName: string): string {
    // Generate placeholder images based on product name
    const seed = productName.toLowerCase().replace(/\s+/g, '-');
    return `https://picsum.photos/seed/${seed}/300/200.jpg`;
  }

  onImageError(event: any): void {
    // Fallback to a generic placeholder if image fails to load
    event.target.src = 'https://picsum.photos/seed/placeholder/300/200.jpg';
  }
}
