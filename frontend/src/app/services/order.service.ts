import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/product.models';

const API_URL = 'http://localhost:8080/api/orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(API_URL);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(API_URL + '/my-orders');
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(API_URL + '/' + id);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(API_URL, order);
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.put<Order>(API_URL + '/' + id + '/status', status);
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(API_URL + '/' + id);
  }
}
