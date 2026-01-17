import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.models';
import { CartService } from '../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageUtils } from '../utils/image.utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  searchTerm = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    if (this.searchTerm) {
      this.productService.searchProducts(this.searchTerm).subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.productService.getAllProducts().subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onSearch(): void {
    this.loadProducts();
  }

  onSearchChange(): void {
    if (!this.searchTerm) {
      this.loadProducts();
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.snackBar.open(`${product.name} added to cart!`, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  viewProductDetails(product: Product): void {
    // Navigate to product details page (you can implement this later)
    console.log('View details for:', product);
    this.snackBar.open(`Opening details for ${product.name}`, 'Close', {
      duration: 2000
    });
  }

  getDefaultImage(productName: string): string {
    return ImageUtils.getDefaultProductImage(productName);
  }

  onImageError(event: any): void {
    ImageUtils.onProductImageError(event);
  }
}
