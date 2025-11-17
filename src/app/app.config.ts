import { 
  ApplicationConfig, 
  provideZonelessChangeDetection, 
  APP_INITIALIZER
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { RouteConfigService } from '../common/services/route-config.service';
import { GetUserUseCase } from '../features/user/application/get-user.usecase';
import { UserService } from '../features/user/infrastructure/user.service';
import { IpService } from '../common/services/ip.service';
import { authInterceptor } from '../common/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor])),

    // Provider to load IP address on startup
    {
      provide: APP_INITIALIZER,
      useFactory: (ipService: IpService) => () => ipService.loadIpAddress(),
      deps: [IpService],
      multi: true,
    },
    
    // Use case provider
    {
      provide: GetUserUseCase,
      useClass: UserService
    },
    
    // Global services
    RouteConfigService,
  ]
};
