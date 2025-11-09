import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../infrastructure/auth.service';
import { AlertService } from '../../../../common/services/alert.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  isLoading = signal(false);
  emailSent = signal(false);

  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get f() { return this.forgotPasswordForm.controls; }

  // requestPasswordReset() {
  //   if (this.forgotPasswordForm.invalid) {
  //     this.forgotPasswordForm.markAllAsTouched();
  //     this.alertService.warning('Por favor, ingresa un email válido.', {
  //       title: 'Email Requerido',
  //       duration: 4000
  //     });
  //     return;
  //   }

  //   this.isLoading.set(true);
  //   const { email } = this.forgotPasswordForm.value;
    
  //   this.authService.requestPasswordReset(email).subscribe({
  //     next: (success) => {
  //       this.isLoading.set(false);
  //       if (success) {
  //         this.emailSent.set(true);
  //         // Navigate back to login after showing success message
  //         setTimeout(() => {
  //           this.router.navigate(['/auth']);
  //         }, 3000);
  //       }
  //     },
  //     error: () => {
  //       this.isLoading.set(false);
  //       // Error handling is done in AuthService
  //     }
  //   });
  // }

  goBackToLogin() {
    this.router.navigate(['/auth']);
  }
}
