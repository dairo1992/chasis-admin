import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();
  
  // Signal para reactive updates
  alerts = signal<Alert[]>([]);

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getDefaultIcon(type: Alert['type']): string {
    const icons = {
      success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return icons[type];
  }

  private addAlert(alert: Omit<Alert, 'id'>): void {
    const newAlert: Alert = {
      ...alert,
      id: this.generateId(),
      dismissible: alert.dismissible ?? true,
      icon: alert.icon ?? this.getDefaultIcon(alert.type)
    };

    const currentAlerts = this.alertsSubject.value;
    const updatedAlerts = [...currentAlerts, newAlert];
    
    this.alertsSubject.next(updatedAlerts);
    this.alerts.set(updatedAlerts);

    // Auto-dismiss if duration is specified
    if (alert.duration && alert.duration > 0) {
      setTimeout(() => {
        this.dismiss(newAlert.id);
      }, alert.duration);
    }
  }

  success(message: string, options?: Partial<Omit<Alert, 'id' | 'type' | 'message'>>): void {
    this.addAlert({
      type: 'success',
      message,
      duration: options?.duration ?? 5000,
      ...options
    });
  }

  error(message: string, options?: Partial<Omit<Alert, 'id' | 'type' | 'message'>>): void {
    this.addAlert({
      type: 'error',
      message,
      duration: options?.duration ?? 0, // Errors don't auto-dismiss by default
      ...options
    });
  }

  warning(message: string, options?: Partial<Omit<Alert, 'id' | 'type' | 'message'>>): void {
    this.addAlert({
      type: 'warning',
      message,
      duration: options?.duration ?? 7000,
      ...options
    });
  }

  info(message: string, options?: Partial<Omit<Alert, 'id' | 'type' | 'message'>>): void {
    this.addAlert({
      type: 'info',
      message,
      duration: options?.duration ?? 5000,
      ...options
    });
  }

  dismiss(id: string): void {
    const currentAlerts = this.alertsSubject.value;
    const updatedAlerts = currentAlerts.filter(alert => alert.id !== id);
    
    this.alertsSubject.next(updatedAlerts);
    this.alerts.set(updatedAlerts);
  }

  dismissAll(): void {
    this.alertsSubject.next([]);
    this.alerts.set([]);
  }

  // Convenience method to show a simple message
  show(type: Alert['type'], message: string, duration?: number): void {
    this.addAlert({
      type,
      message,
      duration
    });
  }
}
