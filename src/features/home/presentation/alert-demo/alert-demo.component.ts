import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../common/services/alert.service';

@Component({
  selector: 'app-alert-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Demo de Alertas con daisyUI</h2>
        <p class="text-base-content/70 mb-6">
          Prueba los diferentes tipos de alertas disponibles en el sistema.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Success Alert -->
          <div class="card bg-success/10 border border-success/20">
            <div class="card-body">
              <h3 class="card-title text-success">Alerta de Éxito</h3>
              <p class="text-sm">Muestra mensajes de operaciones exitosas.</p>
              <div class="card-actions justify-end">
                <button 
                  class="btn btn-success btn-sm"
                  (click)="showSuccessAlert()">
                  Mostrar Éxito
                </button>
              </div>
            </div>
          </div>

          <!-- Error Alert -->
          <div class="card bg-error/10 border border-error/20">
            <div class="card-body">
              <h3 class="card-title text-error">Alerta de Error</h3>
              <p class="text-sm">Muestra mensajes de error que requieren atención.</p>
              <div class="card-actions justify-end">
                <button 
                  class="btn btn-error btn-sm"
                  (click)="showErrorAlert()">
                  Mostrar Error
                </button>
              </div>
            </div>
          </div>

          <!-- Warning Alert -->
          <div class="card bg-warning/10 border border-warning/20">
            <div class="card-body">
              <h3 class="card-title text-warning">Alerta de Advertencia</h3>
              <p class="text-sm">Muestra advertencias importantes.</p>
              <div class="card-actions justify-end">
                <button 
                  class="btn btn-warning btn-sm"
                  (click)="showWarningAlert()">
                  Mostrar Advertencia
                </button>
              </div>
            </div>
          </div>

          <!-- Info Alert -->
          <div class="card bg-info/10 border border-info/20">
            <div class="card-body">
              <h3 class="card-title text-info">Alerta Informativa</h3>
              <p class="text-sm">Muestra información general al usuario.</p>
              <div class="card-actions justify-end">
                <button 
                  class="btn btn-info btn-sm"
                  (click)="showInfoAlert()">
                  Mostrar Info
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Examples -->
        <div class="divider">Ejemplos Avanzados</div>
        
        <div class="flex flex-wrap gap-2">
          <button 
            class="btn btn-outline btn-sm"
            (click)="showAlertWithTitle()">
            Con Título
          </button>
          
          <button 
            class="btn btn-outline btn-sm"
            (click)="showPersistentAlert()">
            Persistente
          </button>
          
          <button 
            class="btn btn-outline btn-sm"
            (click)="showQuickAlert()">
            Rápida (2s)
          </button>
          
          <button 
            class="btn btn-outline btn-sm"
            (click)="showMultipleAlerts()">
            Múltiples
          </button>
          
          <button 
            class="btn btn-outline btn-error btn-sm"
            (click)="dismissAllAlerts()">
            Cerrar Todas
          </button>
        </div>

        <!-- Usage Instructions -->
        <div class="divider">Instrucciones de Uso</div>
        
        <div class="mockup-code">
          <pre><code>// Inyectar el servicio
private alertService = inject(AlertService);

// Mostrar alertas básicas
this.alertService.success('Operación exitosa');
this.alertService.error('Error en la operación');
this.alertService.warning('Advertencia importante');
this.alertService.info('Información relevante');

// Alertas con opciones
this.alertService.success('Guardado exitoso', {{ '{' }}
  title: 'Éxito',
  duration: 3000,
  dismissible: true
{{ '}' }});

// Cerrar alertas
this.alertService.dismiss(alertId);
this.alertService.dismissAll();</code></pre>
        </div>
      </div>
    </div>
  `
})
export class AlertDemoComponent {
  private alertService = inject(AlertService);

  showSuccessAlert() {
    this.alertService.success('¡Operación completada exitosamente!');
  }

  showErrorAlert() {
    this.alertService.error('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
  }

  showWarningAlert() {
    this.alertService.warning('Ten cuidado: esta acción no se puede deshacer.');
  }

  showInfoAlert() {
    this.alertService.info('Nueva actualización disponible. Revisa las novedades.');
  }

  showAlertWithTitle() {
    this.alertService.success('Los cambios han sido guardados correctamente en el servidor.', {
      title: 'Guardado Exitoso',
      duration: 4000
    });
  }

  showPersistentAlert() {
    this.alertService.error('Error crítico del sistema. Contacta al administrador.', {
      title: 'Error Crítico',
      duration: 0, // No se cierra automáticamente
      dismissible: true
    });
  }

  showQuickAlert() {
    this.alertService.info('Mensaje rápido', {
      duration: 2000
    });
  }

  showMultipleAlerts() {
    this.alertService.info('Primera alerta');
    setTimeout(() => this.alertService.success('Segunda alerta'), 500);
    setTimeout(() => this.alertService.warning('Tercera alerta'), 1000);
  }

  dismissAllAlerts() {
    this.alertService.dismissAll();
  }
}
