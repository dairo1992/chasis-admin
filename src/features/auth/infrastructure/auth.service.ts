import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AlertService } from '../../../common/services/alert.service';
import { environment } from '../../../environments/environment';
import { ApiAuth } from '../application/route/api-auth';
import { LoginResponse } from '../interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private isBrowser: boolean;
  private alertService = inject(AlertService);
  private readonly apiUrl = environment.apiUrl;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  login(email: string, password: string, remember: boolean): Observable<any> {
    const endpoint = ApiAuth['login'].path;
    const v = ApiAuth['login'].version;
    const url = `${this.apiUrl}/${v}/${endpoint}`;

    return this.http.post<any>(url, { username: email, password }).pipe(
      tap(response => {
        if (this.isBrowser && response.access_token) {
          this.storeTokens(response);
          if (remember) {
            localStorage.setItem('remember', email);
          } else {
            localStorage.removeItem('remember');
          }
          this.alertService.success('Login successful!');
        }
      })
    );
  }

  refreshToken(): Observable<any> {
    if (!this.isBrowser) {
      return throwError(() => new Error('Cannot refresh token on the server.'));
    }

    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        tap(token => {
          if (!token) {
            this.logout();
            return throwError(() => new Error('Failed to refresh token'));
          }
          return token;
        })
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.isRefreshing = false;
      this.logout();
      return throwError(() => new Error('Refresh token not found'));
    }

    const endpoint = ApiAuth['refresh'].path;
    const url = `${this.apiUrl}/${endpoint}`;

    return this.http.post<LoginResponse>(url, { refreshToken }).pipe(
      tap((response) => {
        this.isRefreshing = false;
        if (response && response.access_token) {
          this.storeTokens(response);
          this.refreshTokenSubject.next(response.access_token);
        } else {
          this.logout();
        }
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('session_id');
      this.router.navigate(['/login']); // Asumiendo que tienes una ruta de login
    }
  }

  isAuthenticated(): boolean {
    if (this.isBrowser) {
      const token = localStorage.getItem('access_token');
      return !!token;
    }
    return false;
  }

  private storeTokens(tokens: any) {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem('access_token', tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
    if (tokens.session_id) {
      localStorage.setItem('session_id', tokens.session_id);
    }
  }
}
