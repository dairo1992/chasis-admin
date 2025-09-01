// src/features/user/user-feature.module.ts
import { FeatureFactory, FeatureConfig, FeatureModule } from '../../common/factories/feature.factory';
import { HomeComponent } from '../home/presentation/home.component';

export class UserFeatureModule extends FeatureModule {
  getConfig(): FeatureConfig {
    return {
      name: 'user',
      displayName: 'Gestión de Usuarios',
      version: '1.0.0',
      routes: [
        {
          path: 'users',
          children: [
            { path: '', component: HomeComponent },
            { path: 'create', component: HomeComponent },
            { path: ':id', component: HomeComponent }
          ]
        }
      ],
      menuItems: [
        {
          label: 'Usuarios',
          icon: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
          order: 2,
          children: [
            {
              label: 'Lista de Usuarios',
              icon: 'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z',
              path: '/users'
            },
            {
              label: 'Crear Usuario',
              icon: 'M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z',
              path: '/users/create'
            }
          ]
        }
      ]
    };
  }
}

// Registrar el feature
const userFeature = new UserFeatureModule();
FeatureFactory.registerFeature(userFeature.getConfig());