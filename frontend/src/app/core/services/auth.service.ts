import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Observable } from "rxjs";
import { AuthResponse, LoginRequest, User } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}`;

    // Register
    register(userData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, userData);
    }

    // Login
    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, {
            withCredentials: true
        });
    }

    // Logout
    logout(): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
            withCredentials: true
        });
    }

    // Get Profile
    getProfile(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/profile`, {
            withCredentials: true
        });
    }
}