import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order } from '../models/product.models';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = false;
  displayedColumns: string[] = ['id', 'totalAmount', 'status', 'createdAt', 'actions'];

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'CONFIRMED': return 'status-confirmed';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'CONFIRMED': return 'blue';
      case 'SHIPPED': return 'purple';
      case 'DELIVERED': return 'green';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  }

  cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: (response) => {
          this.snackBar.open('Order cancelled successfully', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.loadOrders(); // Refresh the orders list
        },
        error: (error) => {
          this.snackBar.open('Failed to cancel order. Please try again.', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
          console.error('Cancel order error:', error);
        }
      });
    }
  }
}
