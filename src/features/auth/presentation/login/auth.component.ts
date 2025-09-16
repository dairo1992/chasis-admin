import { ChangeDetectionStrategy, Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../infrastructure/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);

  showPassword = false;
  isLoading = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [false]
  });

  get f() { return this.loginForm.controls; }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/']);
      }

      const rememberedEmail = localStorage.getItem('remember');
      if (rememberedEmail) {
        this.loginForm.patchValue({
          email: rememberedEmail,
          remember: true
        });
      }
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
    const { email, password, remember } = this.loginForm.value;

    this.authService.login(email, password, remember).subscribe({
      next: (success) => {
        this.isLoading.set(false);
        if (success) {

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