import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.models';
import { CartService } from '../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  quantity = 1;
  relatedProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(productId);
    } else {
      this.router.navigate(['/products']);
    }
  }

  loadProductDetails(productId: string): void {
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        this.loadRelatedProducts(product.categoryId);
      },
      error: (error) => {
        console.error('Error loading product details:', error);
        this.snackBar.open('Product not found', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/products']);
      }
    });
  }

  loadRelatedProducts(categoryId: string): void {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        // Filter out the current product and limit to 4 related products
        this.relatedProducts = products
          .filter(p => p.id !== this.product?.id)
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }

  addToCart(): void {
    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
      this.snackBar.open(`${this.quantity} × ${this.product.name} added to cart!`, 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    this.location.back();
  }

  viewRelatedProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  getStockStatus(): string {
    if (!this.product) return '';
    
    if (this.product.stockQuantity === 0) {
      return 'Out of Stock';
    } else if (this.product.stockQuantity <= 5) {
      return `Only ${this.product.stockQuantity} left in stock`;
    } else {
      return 'In Stock';
    }
  }

  getStockStatusClass(): string {
    if (!this.product) return '';
    
    if (this.product.stockQuantity === 0) {
      return 'out-of-stock';
    } else if (this.product.stockQuantity <= 5) {
      return 'low-stock';
    } else {
      return 'in-stock';
    }
  }
}
