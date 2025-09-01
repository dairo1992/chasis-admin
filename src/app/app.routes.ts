// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from '../common/layout/layout.component';
import { HomeComponent } from '../features/home/presentation/home.component';
import { FeatureFactory } from '../common/factories/feature.factory';

// Importar y registrar features
import '../features/user/user-feature.module';

// Función para construir rutas dinámicamente
function buildRoutes(): Routes {
  const featureRoutes = FeatureFactory.getAllRoutes();
  
  return [
    {
      path: '',
      component: LayoutComponent,
      children: [
        {
          path: '',
          component: HomeComponent,
          data: {
            title: 'Home',
            breadcrumb: 'Inicio'
          }
        },
        ...featureRoutes,
        {
          path: '**',
          redirectTo: ''
        }
      ]
    }
  ];
}

// Exportar rutas
export const routes: Routes = buildRoutes();

// Validar configuración de features en desarrollo
if (typeof ngDevMode !== 'undefined' && ngDevMode) {
  const validation = FeatureFactory.validateFeatures();
  if (!validation.isValid) {
    console.error('Feature validation failed:', validation.errors);
  } else {
    console.log('✓ All features validated successfully');
    console.log('Registered features:', FeatureFactory.getAllFeatures().map(f => f.name));
  }
}