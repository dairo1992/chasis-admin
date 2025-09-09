import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      @for (alert of alerts(); track alert.id) {
        <div 
          class="alert transition-all duration-300 ease-in-out transform"
          [class]="getAlertClasses(alert.type)"
          role="alert">
          
          <!-- Icon -->
          <svg 
            class="w-6 h-6 shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              [attr.d]="alert.icon">
            </path>
          </svg>
          
          <!-- Content -->
          <div class="flex-1">
            @if (alert.title) {
              <h3 class="font-bold text-sm">{{ alert.title }}</h3>
            }
            <div class="text-sm">{{ alert.message }}</div>
          </div>
          
          <!-- Dismiss button -->
          @if (alert.dismissible) {
            <button 
              class="btn btn-sm btn-circle btn-ghost"
              (click)="dismiss(alert.id)"
              aria-label="Cerrar alerta">
              <svg 
                class="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12">
                </path>
              </svg>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .alert {
      @apply shadow-lg;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .alert.removing {
      animation: slideOut 0.3s ease-in forwards;
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `]
})
export class AlertComponent implements OnInit, OnDestroy {
  private alertService = inject(AlertService);
  private subscription?: Subscription;
  
  alerts = this.alertService.alerts;

  ngOnInit() {
    // Subscribe to alerts for any additional logic if needed
    this.subscription = this.alertService.alerts$.subscribe();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getAlertClasses(type: Alert['type']): string {
    const baseClasses = 'alert';
    
    switch (type) {
      case 'success':
        return `${baseClasses} alert-success`;
      case 'error':
        return `${baseClasses} alert-error`;
      case 'warning':
        return `${baseClasses} alert-warning`;
      case 'info':
        return `${baseClasses} alert-info`;
      default:
        return baseClasses;
    }
  }

  dismiss(id: string) {
    this.alertService.dismiss(id);
  }
}
