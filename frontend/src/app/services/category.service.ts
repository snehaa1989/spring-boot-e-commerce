import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/product.models';

const API_URL = 'http://localhost:8080/api/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(API_URL);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(API_URL + '/' + id);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(API_URL, category);
  }

  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(API_URL + '/' + id, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(API_URL + '/' + id);
  }
}
