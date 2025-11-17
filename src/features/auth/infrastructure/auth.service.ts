import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
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
  private readonly _currentUser = signal<LoginResponse | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const user = sessionStorage.getItem('currentUser');
      if (user) {
        this._currentUser.set(JSON.parse(user));
      }
    }
  }

  get currentUser() {
    return this._currentUser;
  }

  login(email: string, password: string, remember: boolean): Observable<LoginResponse> {
    const endpoint = ApiAuth.login.path
    const v = ApiAuth.login.version;
    const url = `${this.apiUrl}/${v}/${endpoint}`;

    return this.http.post<LoginResponse>(url, { username: email, password }).pipe(
      tap(response => {
        if (this.isBrowser && response.access_token) {
          this.storeTokens(response);
          if (remember) {
            localStorage.setItem('remember', email);
          } else {
            localStorage.removeItem('remember');
          }
          this._currentUser.set(response);
          sessionStorage.setItem('currentUser', JSON.stringify(response));
          this.alertService.success('Inicio de sesión exitoso', {
            title: `Bienvenido ${response.user?.firstName}`,
            duration: 3000
          });
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

    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.isRefreshing = false;
      this.logout();
      return throwError(() => new Error('Refresh token not found'));
    }

    const endpoint = ApiAuth.refresh.path
    const v = ApiAuth.refresh.version;
    const url = `${this.apiUrl}/${v}/${endpoint}`;

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
      const endpoint = ApiAuth.logout.path
      const v = ApiAuth.logout.version;
      const url = `${this.apiUrl}/${v}/${endpoint}`;
      this.http.get(url).pipe(
        catchError(err => {
          console.error('Logout failed on server', err);
          return throwError(() => err);
        }),
        tap(() => {
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('refresh_token');
          sessionStorage.removeItem('session_id');
          this.router.navigate(['/auth']);
        })
      ).subscribe();
      sessionStorage.removeItem('currentUser');
    }
  }

  isAuthenticated(): boolean {
    if (this.isBrowser) {
      const token = sessionStorage.getItem('access_token');
      return !!token;
    }
    return false;
  }

  private storeTokens(tokens: any) {
    if (!this.isBrowser) {
      return;
    }
    sessionStorage.setItem('access_token', tokens.access_token);
    if (tokens.refresh_token) {
      sessionStorage.setItem('refresh_token', tokens.refresh_token);
    }
    if (tokens.session_id) {
      sessionStorage.setItem('session_id', tokens.session_id);
    }
  }
}
