import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../features/auth/infrastructure/auth.service';
import { IpService } from '../services/ip.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const ipService = inject(IpService);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  // Always add the IP address header if available
  let headers = req.headers;
  const userIp = ipService.currentIp;
  if (userIp) {
    headers = headers.set('X-Forwarded-For', userIp);
  }
  
  const reqWithIp = req.clone({ headers });

  // All subsequent logic is browser-only
  if (!isBrowser) {
    return next(reqWithIp);
  }

  // Add auth token and handle request only in the browser
  return next(addTokenHeader(reqWithIp)).pipe(
    catchError((error: HttpErrorResponse) => {
      // If it's not a 401, just re-throw the error
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // On 401 error, try to refresh the token
      return authService.refreshToken().pipe(
        switchMap((response: any) => {
          // If refresh is successful, retry the original request with the new token
          return next(addTokenHeader(reqWithIp));
        }),
        catchError((refreshError) => {
          // If refresh fails, logout is handled in authService, just propagate the error
          return throwError(() => refreshError);
        })
      );
    })
  );
};

// Helper function to add the auth token and session ID to headers
const addTokenHeader = (req: HttpRequest<any>): HttpRequest<any> => {
  const accessToken = localStorage.getItem('access_token');
  const sessionId = localStorage.getItem('session_id');
  
  let headers = req.headers;

  if (accessToken) {
    headers = headers.set('Authorization', `Bearer ${accessToken}`);
  }
  if (sessionId) {
    headers = headers.set('Session-Id', sessionId);
  }

  return req.clone({ headers });
}
