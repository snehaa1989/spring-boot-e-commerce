import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
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

  getDefaultImage(productName: string): string {
    // Generate placeholder images based on product name
    const seed = productName.toLowerCase().replace(/\s+/g, '-');
    return `https://picsum.photos/seed/${seed}/300/200.jpg`;
  }

  onImageError(event: any): void {
    // Fallback to a generic placeholder if image fails to load
    event.target.src = 'https://picsum.photos/seed/placeholder/300/200.jpg';
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.snackBar.open(`${product.name} added to cart`, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
