// src/app/app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { RouteConfigService } from '../common/services/route-config.service';
import { GetUserUseCase } from '../features/user/application/get-user.usecase';
import { UserService } from '../features/user/infrastructure/user.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    {
      provide: GetUserUseCase,
      useClass: UserService
    },
    // Asegurar que RouteConfigService esté disponible globalmente
    RouteConfigService
  ]
};