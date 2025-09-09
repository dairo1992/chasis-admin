# Sistema de Alertas con daisyUI

Este sistema de alertas proporciona una forma elegante y consistente de mostrar mensajes al usuario utilizando los componentes de daisyUI.

## Características

- ✅ **4 tipos de alertas**: Success, Error, Warning, Info
- ✅ **Auto-dismiss configurable**: Las alertas pueden cerrarse automáticamente
- ✅ **Dismissible manual**: Los usuarios pueden cerrar alertas manualmente
- ✅ **Múltiples alertas**: Soporte para mostrar varias alertas simultáneamente
- ✅ **Animaciones suaves**: Transiciones de entrada y salida
- ✅ **Iconos automáticos**: Cada tipo tiene su icono predeterminado
- ✅ **Títulos opcionales**: Soporte para títulos en las alertas
- ✅ **Posicionamiento fijo**: Las alertas aparecen en la esquina superior derecha

## Instalación

El sistema ya está integrado en el layout principal de la aplicación. No se requiere configuración adicional.

## Uso Básico

### 1. Inyectar el servicio

```typescript
import { AlertService } from '../../../common/services/alert.service';

@Component({...})
export class MiComponente {
  private alertService = inject(AlertService);
  
  // o usando constructor injection
  constructor(private alertService: AlertService) {}
}
```

### 2. Mostrar alertas básicas

```typescript
// Alerta de éxito (se cierra automáticamente en 5s)
this.alertService.success('Operación completada exitosamente');

// Alerta de error (no se cierra automáticamente)
this.alertService.error('Ha ocurrido un error');

// Alerta de advertencia (se cierra automáticamente en 7s)
this.alertService.warning('Ten cuidado con esta acción');

// Alerta informativa (se cierra automáticamente en 5s)
this.alertService.info('Nueva actualización disponible');
```

### 3. Alertas con opciones avanzadas

```typescript
this.alertService.success('Datos guardados correctamente', {
  title: 'Éxito',
  duration: 3000,        // 3 segundos
  dismissible: true,     // Puede cerrarse manualmente
  icon: 'custom-icon'    // Icono personalizado (opcional)
});

// Alerta persistente (no se cierra automáticamente)
this.alertService.error('Error crítico del sistema', {
  title: 'Error Crítico',
  duration: 0,           // 0 = no se cierra automáticamente
  dismissible: true
});
```

### 4. Gestión de alertas

```typescript
// Cerrar una alerta específica (necesitas el ID)
this.alertService.dismiss(alertId);

// Cerrar todas las alertas
this.alertService.dismissAll();

// Método genérico
this.alertService.show('success', 'Mensaje', 5000);
```

## Interfaz Alert

```typescript
interface Alert {
  id: string;                    // ID único generado automáticamente
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;                // Título opcional
  message: string;               // Mensaje principal
  duration?: number;             // Duración en ms (0 = persistente)
  dismissible?: boolean;         // Si puede cerrarse manualmente
  icon?: string;                 // Icono SVG path (opcional)
}
```

## Configuración por Defecto

| Tipo | Duración | Dismissible | Icono |
|------|----------|-------------|-------|
| Success | 5000ms | ✅ | Check circle |
| Error | 0ms (persistente) | ✅ | X circle |
| Warning | 7000ms | ✅ | Exclamation triangle |
| Info | 5000ms | ✅ | Information circle |

## Clases CSS de daisyUI

El componente utiliza las siguientes clases de daisyUI:

- `alert` - Clase base
- `alert-success` - Alerta de éxito (verde)
- `alert-error` - Alerta de error (rojo)
- `alert-warning` - Alerta de advertencia (amarillo)
- `alert-info` - Alerta informativa (azul)

## Personalización

### Cambiar posición

Para cambiar la posición de las alertas, modifica las clases en `alert.component.ts`:

```typescript
// Cambiar de top-right a top-left
class="fixed top-4 left-4 z-50 space-y-2 max-w-md"

// Cambiar a bottom-right
class="fixed bottom-4 right-4 z-50 space-y-2 max-w-md"
```

### Personalizar animaciones

Las animaciones se definen en los estilos del componente:

```css
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
```

## Ejemplos de Uso Común

### Formularios

```typescript
onSubmit() {
  this.userService.save(this.form.value).subscribe({
    next: () => {
      this.alertService.success('Usuario guardado exitosamente');
    },
    error: (error) => {
      this.alertService.error('Error al guardar usuario: ' + error.message);
    }
  });
}
```

### Operaciones de eliminación

```typescript
onDelete(id: string) {
  this.alertService.warning('¿Estás seguro? Esta acción no se puede deshacer', {
    title: 'Confirmar eliminación',
    duration: 0,
    dismissible: true
  });
}
```

### Notificaciones del sistema

```typescript
ngOnInit() {
  this.websocketService.notifications$.subscribe(notification => {
    this.alertService.info(notification.message, {
      title: notification.title,
      duration: 4000
    });
  });
}
```

## Integración con Reactive Forms

```typescript
onFormSubmit() {
  if (this.form.valid) {
    this.alertService.success('Formulario válido');
  } else {
    this.alertService.error('Por favor, corrige los errores en el formulario');
  }
}
```

## Mejores Prácticas

1. **Usa mensajes claros y concisos**
2. **Proporciona contexto suficiente** en los mensajes de error
3. **No abuses de las alertas persistentes** (duration: 0)
4. **Usa títulos para alertas importantes**
5. **Considera la experiencia del usuario** al elegir duraciones
6. **Agrupa alertas relacionadas** usando `dismissAll()` antes de mostrar nuevas

## Troubleshooting

### Las alertas no aparecen
- Verifica que `<app-alert></app-alert>` esté en el layout
- Confirma que el `AlertService` esté importado correctamente

### Problemas de estilo
- Asegúrate de que daisyUI esté configurado en `tailwind.config.js`
- Verifica que las clases de daisyUI estén disponibles

### Alertas no se cierran automáticamente
- Revisa que `duration` sea mayor a 0
- Confirma que no hay errores en la consola del navegador
