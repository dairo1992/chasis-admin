// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from '../common/layout/layout.component';
import { HomeComponent } from '../features/home/presentation/home.component';
import { FeatureFactory } from '../common/factories/feature.factory';
import { authGuard } from '../features/auth/application/auth.guard';
import { publicGuard } from '../features/auth/application/public.guard';

// Importar y registrar features
import '../features/user/user-feature.module';
import '../features/auth/auth-feature.module';

// Función para construir rutas dinámicamente
function buildRoutes(): Routes {
  const featureRoutes = FeatureFactory.getAllRoutes();

  return [
    {
      path: 'login',
      loadComponent: () => import('../features/auth/presentation/login/auth.component'),
      canActivate: [publicGuard]
    },
    {
      path: 'register',
      loadComponent: () => import('../features/auth/presentation/register/register.component').then(m => m.RegisterComponent),
      canActivate: [publicGuard]
    },
    {
      path: 'forgot-password',
      loadComponent: () => import('../features/auth/presentation/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
      canActivate: [publicGuard]
    },
    {
      path: 'auth', // Add this route
      loadComponent: () => import('../features/auth/presentation/login/auth.component'),
      canActivate: [publicGuard] // Apply publicGuard here too
    },
    {
      path: '',
      component: LayoutComponent,
      canActivate: [authGuard],
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
      ]
    },
    {
      path: '**',
      redirectTo: '/'
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
    console.log('✅ ChasisAdmin SSR application bootstrapped successfully');
    console.log('✅ All features validated successfully');
    console.log('📦 Registered features:', FeatureFactory.getAllFeatures().map(f => f.name));
  }
}
