import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, User } from '../models/user.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`; 

  // register
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // login
  login(credentials: LoginRequest): Observable<{ user: User, token: string }> {
    return this.http.post<{ user: User, token: string }>(`${this.apiUrl}/login`, credentials);
  }

  // Get Profile through Protected Route
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/protected/profile`);
  }
}