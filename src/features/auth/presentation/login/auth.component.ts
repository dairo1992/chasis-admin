import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../infrastructure/auth.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../common/services/alert.service';
import { AlertComponent } from "../../../../common/components/alert/alert.component";

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, AlertComponent],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export default class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  showPassword = false;
  isLoading = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['admin@chasis.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required]],
  });

  get f() { return this.loginForm.controls; }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.alertService.warning('Por favor, completa todos los campos requeridos.', {
        title: 'Formulario Incompleto',
        duration: 4000
      });
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: (success) => {
        this.isLoading.set(false);
        if (success) {
          // Small delay to show success message before navigation
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        }
      },
      error: () => {
        this.isLoading.set(false);
        // Error handling is done in AuthService
      }
    });
  }
}