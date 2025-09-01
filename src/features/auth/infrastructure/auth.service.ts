import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_KEY = 'isAuthenticated';

  login(email: string, password: string): Observable<boolean> {
    // Mock login logic
    if (email === 'admin@chasis.com' && password === '123456') {
      return of(true).pipe(
        tap(() => localStorage.setItem(this.AUTH_KEY, 'true'))
      );
    }
    return of(false);
  }

  logout() {
    localStorage.removeItem(this.AUTH_KEY);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }
}
