// src/common/services/route-registry.service.ts
import { Injectable, Type } from '@angular/core';
import { Route } from '@angular/router';

export interface FeatureModule {
  name: string;
  routes: Route[];
  menuConfig?: any;
  lazy?: boolean;
  loadComponent?: () => Promise<Type<any>>;
}

@Injectable({
  providedIn: 'root'
})
export class RouteRegistryService {
  private features: Map<string, FeatureModule> = new Map();
  private initialized = false;

  registerFeature(feature: FeatureModule) {
    if (this.initialized) {
      console.warn(`Feature ${feature.name} registered after initialization`);
    }
    this.features.set(feature.name, feature);
  }

  getFeature(name: string): FeatureModule | undefined {
    return this.features.get(name);
  }

  getAllFeatures(): FeatureModule[] {
    return Array.from(this.features.values());
  }

  getAllRoutes(): Route[] {
    const allRoutes: Route[] = [];
    this.features.forEach(feature => {
      allRoutes.push(...feature.routes);
    });
    return allRoutes;
  }

  unregisterFeature(name: string): boolean {
    return this.features.delete(name);
  }

  markAsInitialized() {
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  // Método para cargar features lazy
  async loadLazyFeature(name: string): Promise<FeatureModule | null> {
    const feature = this.features.get(name);
    if (feature && feature.lazy && feature.loadComponent) {
      try {
        const component = await feature.loadComponent();
        return {
          ...feature,
          // Actualizar con el componente cargado
        };
      } catch (error) {
        console.error(`Error loading lazy feature ${name}:`, error);
        return null;
      }
    }
    return feature || null;
  }
}