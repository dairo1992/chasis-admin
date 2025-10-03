import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
    templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
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
