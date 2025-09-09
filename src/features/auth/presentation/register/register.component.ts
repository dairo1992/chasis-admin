import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../infrastructure/auth.service';
import { AlertService } from '../../../../common/services/alert.service';
import { AlertComponent } from '../../../../common/components/alert/alert.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  showPassword = false;
  showPasswordConfirm = false;
  isLoading = signal(false);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required]],
  }, { validator: this.passwordMatchValidator });

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('passwordConfirm')?.value
      ? null : { 'mismatch': true };
  }

  get f() { return this.registerForm.controls; }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmVisibility() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.alertService.warning('Por favor, completa todos los campos correctamente.', {
        title: 'Formulario Incompleto',
        duration: 4000
      });
      return;
    }

    this.isLoading.set(true);
    const { email, password, passwordConfirm, name } = this.registerForm.value;

    this.authService.register({ email, password, passwordConfirm, name }).subscribe({
      next: (success) => {
        this.isLoading.set(false);
        if (success) {
          // Small delay to show success message before navigation
          setTimeout(() => {
            this.router.navigate(['/auth']);
          }, 2000);
        }
      },
      error: () => {
        this.isLoading.set(false);
        // Error handling is done in AuthService
      }
    });
  }
}
