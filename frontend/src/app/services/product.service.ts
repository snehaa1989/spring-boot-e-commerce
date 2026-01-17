import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category } from '../models/product.models';

const API_URL = 'http://localhost:8080/api/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(API_URL);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(API_URL + '/' + id);
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(API_URL + '/category/' + categoryId);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.http.get<Product[]>(API_URL + '/search?keyword=' + keyword);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(API_URL, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(API_URL + '/' + id, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(API_URL + '/' + id);
  }
}
