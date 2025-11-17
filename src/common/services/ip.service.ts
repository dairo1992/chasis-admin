import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IpService {
  private http = inject(HttpClient);
  private userIp: string | null = null;

  get currentIp(): string | null {
    return this.userIp;
  }

  loadIpAddress(): Observable<string | null> {
    return this.http.get<{ ip: string }>('https://api.ipify.org?format=json').pipe(
      map(response => response.ip),
      tap(ip => {
        this.userIp = ip;
      }),
      catchError(error => {
        console.error('Failed to get IP address', error);
        return of(null);
      })
    );
  }
}
