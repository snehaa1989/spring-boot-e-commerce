import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ImageUtils } from '../utils/image.utils';
import { Order, OrderItem, ShippingAddress } from '../models/product.models';

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal' | 'cash_on_delivery';
  last4?: string;
  cardHolder?: string;
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  orderSummary: OrderSummary = {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  };
  isProcessing = false;
  selectedPaymentMethod: PaymentMethod['type'] = 'credit_card';
  showPaymentForm = false;

  // Shipping options
  shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 12.99, days: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 24.99, days: '1 business day' }
  ];
  selectedShipping = this.shippingOptions[0];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.checkoutForm = this.fb.group({
      // Shipping Information
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5,6}$/)]],
      country: ['United States', [Validators.required]],
      
      // Order Notes
      orderNotes: [''],
      
      // Payment Information
      cardNumber: [''],
      cardHolder: [''],
      expiryDate: [''],
      cvv: [''],
      
      // Billing Address (same as shipping by default)
      sameAsShipping: [true],
      billingAddress: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      })
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Please login to continue with checkout', 'Close', {
        duration: 3000
      });
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateOrderSummary();
      
      if (items.length === 0) {
        this.snackBar.open('Your cart is empty', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/products']);
        return;
      }
    });

    // Pre-fill user information if available
    this.prefillUserInfo();
  }

  prefillUserInfo(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.checkoutForm.patchValue({
        email: user.email,
        fullName: user.username
      });
    }
  }

  calculateOrderSummary(): void {
    const subtotal = this.cartService.getTotalPrice();
    const tax = subtotal * 0.1; // 10% tax
    const shipping = this.selectedShipping.price;
    const total = subtotal + tax + shipping;

    this.orderSummary = {
      items: this.cartItems,
      subtotal,
      tax,
      shipping,
      total
    };
  }

  onShippingChange(): void {
    this.calculateOrderSummary();
  }

  onPaymentMethodChange(method: PaymentMethod['type']): void {
    this.selectedPaymentMethod = method;
    this.showPaymentForm = method !== 'cash_on_delivery';
    
    // Update validators based on payment method
    const cardNumberControl = this.checkoutForm.get('cardNumber');
    const cardHolderControl = this.checkoutForm.get('cardHolder');
    const expiryDateControl = this.checkoutForm.get('expiryDate');
    const cvvControl = this.checkoutForm.get('cvv');

    if (method === 'credit_card' || method === 'debit_card') {
      cardNumberControl?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      cardHolderControl?.setValidators([Validators.required]);
      expiryDateControl?.setValidators([Validators.required]);
      cvvControl?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    } else {
      cardNumberControl?.clearValidators();
      cardHolderControl?.clearValidators();
      expiryDateControl?.clearValidators();
      cvvControl?.clearValidators();
    }

    cardNumberControl?.updateValueAndValidity();
    cardHolderControl?.updateValueAndValidity();
    expiryDateControl?.updateValueAndValidity();
    cvvControl?.updateValueAndValidity();
  }

  onSameAsShippingChange(): void {
    const sameAsShipping = this.checkoutForm.get('sameAsShipping')?.value;
    const billingAddress = this.checkoutForm.get('billingAddress');
    
    if (sameAsShipping) {
      billingAddress?.patchValue({
        street: this.checkoutForm.get('street')?.value,
        city: this.checkoutForm.get('city')?.value,
        state: this.checkoutForm.get('state')?.value,
        zipCode: this.checkoutForm.get('zipCode')?.value,
        country: this.checkoutForm.get('country')?.value
      });
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.snackBar.open('Please fill in all required fields correctly', 'Close', {
        duration: 3000
      });
      return;
    }

    this.isProcessing = true;

    const orderData = {
      items: this.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      shippingAddress: {
        fullName: this.checkoutForm.value.fullName,
        street: this.checkoutForm.value.street,
        city: this.checkoutForm.value.city,
        state: this.checkoutForm.value.state,
        zipCode: this.checkoutForm.value.zipCode,
        country: this.checkoutForm.value.country,
        phone: this.checkoutForm.value.phone
      },
      billingAddress: this.checkoutForm.value.sameAsShipping 
        ? this.checkoutForm.value.shippingAddress
        : this.checkoutForm.value.billingAddress,
      paymentMethod: this.selectedPaymentMethod,
      shippingMethod: this.selectedShipping.id,
      subtotal: this.orderSummary.subtotal,
      tax: this.orderSummary.tax,
      shipping: this.orderSummary.shipping,
      total: this.orderSummary.total,
      orderNotes: this.checkoutForm.value.orderNotes
    };

    // Simulate payment processing
    this.processPayment(orderData);
  }

  processPayment(orderData: any): void {
    // Simulate payment processing delay
    setTimeout(() => {
      // Simulate payment success/failure (90% success rate)
      const paymentSuccess = Math.random() > 0.1;
      
      if (paymentSuccess) {
        this.createOrder(orderData);
      } else {
        this.isProcessing = false;
        this.snackBar.open('Payment failed. Please try again.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    }, 2000);
  }

  createOrder(orderData: any): void {
    // Create proper order structure matching backend model
    const order: any = {
      id: '', // Will be generated by backend
      userId: this.authService.currentUserValue?.username,
      items: this.cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity
      })),
      totalAmount: this.orderSummary.total,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        this.isProcessing = false;
        this.cartService.clearCart();
        this.snackBar.open('Order placed successfully! Order #' + response.id, 'Close', {
          duration: 5000,
          panelClass: 'success-snackbar'
        });
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.isProcessing = false;
        this.snackBar.open('Failed to place order. Please try again.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
        console.error('Order creation error:', error);
      }
    });
  }

  getCardDisplay(): string {
    const cardNumber = this.checkoutForm.get('cardNumber')?.value;
    if (!cardNumber) return '';
    return '**** **** **** ' + cardNumber.slice(-4);
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.checkoutForm.get('cardNumber')?.setValue(formattedValue);
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.checkoutForm.get('expiryDate')?.setValue(value);
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }

  // Form validation getters
  get fullName() { return this.checkoutForm.get('fullName'); }
  get email() { return this.checkoutForm.get('email'); }
  get phone() { return this.checkoutForm.get('phone'); }
  get street() { return this.checkoutForm.get('street'); }
  get city() { return this.checkoutForm.get('city'); }
  get state() { return this.checkoutForm.get('state'); }
  get zipCode() { return this.checkoutForm.get('zipCode'); }
  get country() { return this.checkoutForm.get('country'); }
  get orderNotes() { return this.checkoutForm.get('orderNotes'); }
  get cardNumber() { return this.checkoutForm.get('cardNumber'); }
  get cardHolder() { return this.checkoutForm.get('cardHolder'); }
  get expiryDate() { return this.checkoutForm.get('expiryDate'); }
  get cvv() { return this.checkoutForm.get('cvv'); }
  get sameAsShipping() { return this.checkoutForm.get('sameAsShipping'); }
  get billingAddress() { return this.checkoutForm.get('billingAddress'); }

  // Image utility methods
  getDefaultImage(productName: string): string {
    return ImageUtils.getDefaultProductImage(productName);
  }

  onImageError(event: any): void {
    ImageUtils.onProductImageError(event);
  }
}
