import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { pb } from '../../../common/config/pocketbase';
import { AlertService } from '../../../common/services/alert.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;
  private alertService = inject(AlertService);
  private http = inject(HttpClient);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      pb.authStore.loadFromCookie(document.cookie);
    }
  }

  // Get current user info
  getCurrentUser() {
    if (this.isBrowser && pb.authStore.isValid) {
      return pb.authStore.model;
    }
    return null;
  }

  login(email: string, password: string, remember?: boolean): Observable<boolean> {
    if (!this.isBrowser) {
      this.alertService.error('Error: Funcionalidad no disponible en el servidor');
      return of(false);
    }

    return from(pb.collection('users').authWithPassword(email, password)).pipe(
      map((authData) => {
        const user = authData.record['name'] || authData.record['email'];
        this.alertService.success(`¡Bienvenido ${user}!`, {
          title: 'Login Exitoso',
          duration: 3000
        });
        if (remember) {
          localStorage.setItem('remember', email);
        } else {
          localStorage.removeItem('remember');
        }
        return true;
      }),
      tap(() => {
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
      }),
      catchError((error) => {
        console.error('Login failed:', error);

        // Handle different error types
        if (error.status === 400) {
          this.alertService.error('Credenciales incorrectas. Verifica tu email y contraseña.', {
            title: 'Error de Autenticación',
            duration: 0
          });
        } else if (error.status === 0) {
          this.alertService.error('No se pudo conectar al servidor. Verifica tu conexión a internet.', {
            title: 'Error de Conexión',
            duration: 0
          });
        } else {
          this.alertService.error('Ha ocurrido un error inesperado. Inténtalo de nuevo.', {
            title: 'Error del Sistema',
            duration: 0
          });
        }

        return of(false);
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      pb.authStore.clear();
      document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
      this.alertService.info('Sesión cerrada correctamente', {
        title: 'Logout',
        duration: 3000
      });
    }
  }

  isAuthenticated(): boolean {
    if (this.isBrowser) {
      return pb.authStore.isValid;
    }
    return false;
  }

  register(data: any): Observable<any> {
    this.http.post('http://localhost:3000/api/v1/auth/register', data).subscribe({
      next: (r) => {
        console.log(r);
      }, error(err) {
        console.error(err)
        // this.alertService.error(`Error: ${err}`);
      },
    });
    return of(null);
    // if (!this.isBrowser) {
    //   this.alertService.error('Error: Funcionalidad no disponible en el servidor');
    //   return of(null);
    // }

    // return from(pb.collection('users').create(data)).pipe(
    //   tap((user) => {
    //     this.alertService.success(`Cuenta creada exitosamente para ${user['email']}. Ya puedes iniciar sesión.`, {
    //       title: 'Registro Exitoso',
    //       duration: 5000
    //     });
    //   }),
    //   catchError((error) => {
    //     console.error('Registration failed:', error);

    //     // Handle different registration errors
    //     if (error.status === 400) {
    //       const errorData = error.data;
    //       if (errorData?.email) {
    //         this.alertService.error('Este email ya está registrado. Usa otro email o inicia sesión.', {
    //           title: 'Email Duplicado',
    //           duration: 0
    //         });
    //       } else if (errorData?.password) {
    //         this.alertService.error('La contraseña no cumple con los requisitos mínimos.', {
    //           title: 'Contraseña Inválida',
    //           duration: 0
    //         });
    //       } else {
    //         this.alertService.error('Datos de registro inválidos. Verifica la información.', {
    //           title: 'Error de Validación',
    //           duration: 0
    //         });
    //       }
    //     } else if (error.status === 0) {
    //       this.alertService.error('No se pudo conectar al servidor. Verifica tu conexión a internet.', {
    //         title: 'Error de Conexión',
    //         duration: 0
    //       });
    //     } else {
    //       this.alertService.error('Error al crear la cuenta. Inténtalo de nuevo.', {
    //         title: 'Error del Sistema',
    //         duration: 0
    //       });
    //     }

    //     return throwError(() => error);
    //   })
    // );
  }

  // Method to request password reset
  requestPasswordReset(email: string): Observable<boolean> {
    if (!this.isBrowser) {
      this.alertService.error('Error: Funcionalidad no disponible en el servidor');
      return of(false);
    }

    return from(pb.collection('users').requestPasswordReset(email)).pipe(
      map(() => {
        this.alertService.success(`Se ha enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada.`, {
          title: 'Email Enviado',
          duration: 7000
        });
        return true;
      }),
      catchError((error) => {
        console.error('Password reset failed:', error);

        if (error.status === 400) {
          this.alertService.error('Email no encontrado. Verifica que esté registrado.', {
            title: 'Email No Encontrado',
            duration: 0
          });
        } else if (error.status === 0) {
          this.alertService.error('No se pudo conectar al servidor. Verifica tu conexión a internet.', {
            title: 'Error de Conexión',
            duration: 0
          });
        } else {
          this.alertService.error('Error al enviar el email de recuperación. Inténtalo de nuevo.', {
            title: 'Error del Sistema',
            duration: 0
          });
        }

        return of(false);
      })
    );
  }
}
