import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, SignupRequest, JwtResponse, User } from '../models/auth.models';
import { NotificationService } from './notification.service';

const API_URL = 'http://localhost:8080/api/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private notificationService: NotificationService
  ) {
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    // Initialize properties
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    
    // Check if token is expired
    if (token && this.isTokenExpired(token)) {
      this.clearSession();
    } else if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(API_URL + '/signin', loginRequest).pipe(
      map(response => {
        if (response && response.token) {
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            role: response.role
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(user);
          
          // Add welcome notification
          this.notificationService.addNotification(
            'Welcome Back!',
            `Successfully logged in as ${user.username}`,
            'success'
          );
        }
        return response;
      })
    );
  }

  register(signupRequest: SignupRequest): Observable<any> {
    return this.http.post(API_URL + '/signup', signupRequest, { responseType: 'text' });
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null as any);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return !!(this.currentUserValue && this.currentUserValue.role === 'ROLE_ADMIN');
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch (error) {
      return true; // If token is malformed, consider it expired
    }
  }

  private clearSession(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
