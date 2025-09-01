// src/common/factories/feature.factory.ts
import { Type, InjectionToken } from '@angular/core';
import { Route } from '@angular/router';
import { MenuItem } from '../services/route-config.service';

export interface FeatureConfig {
  name: string;
  displayName: string;
  version: string;
  routes: Route[];
  menuItems: MenuItem[];
  dependencies?: string[];
  providers?: any[];
  lazy?: boolean;
}

export const FEATURE_CONFIG = new InjectionToken<FeatureConfig>('FEATURE_CONFIG');

export abstract class FeatureModule {
  abstract getConfig(): FeatureConfig;
  
  // Métodos opcionales que pueden implementar los features
  onInit?(): void;
  onDestroy?(): void;
  onActivate?(): void;
  onDeactivate?(): void;
}

export class FeatureFactory {
  private static features = new Map<string, FeatureConfig>();
  
  static registerFeature(config: FeatureConfig): void {
    if (this.features.has(config.name)) {
      console.warn(`Feature ${config.name} already registered. Overwriting...`);
    }
    
    // Validar dependencias
    if (config.dependencies) {
      const missingDeps = config.dependencies.filter(dep => !this.features.has(dep));
      if (missingDeps.length > 0) {
        throw new Error(`Feature ${config.name} has missing dependencies: ${missingDeps.join(', ')}`);
      }
    }
    
    this.features.set(config.name, config);
    console.log(`✓ Feature ${config.name} registered successfully`);
  }
  
  static getFeature(name: string): FeatureConfig | undefined {
    return this.features.get(name);
  }
  
  static getAllFeatures(): FeatureConfig[] {
    return Array.from(this.features.values())
      .sort((a, b) => {
        // Ordenar por dependencias primero
        if (a.dependencies?.includes(b.name)) return 1;
        if (b.dependencies?.includes(a.name)) return -1;
        return a.name.localeCompare(b.name);
      });
  }
  
  static getAllRoutes(): Route[] {
    const allRoutes: Route[] = [];
    this.getAllFeatures().forEach(feature => {
      allRoutes.push(...feature.routes);
    });
    return allRoutes;
  }
  
  static getAllMenuItems(): MenuItem[] {
    const allMenuItems: MenuItem[] = [];
    this.getAllFeatures().forEach(feature => {
      allMenuItems.push(...feature.menuItems);
    });
    return allMenuItems.sort((a, b) => (a.order || 999) - (b.order || 999));
  }
  
  static createLazyFeature(importFn: () => Promise<{ default: Type<any> }>): Route {
    return {
      loadComponent: importFn
    };
  }
  
  static validateFeatures(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const features = this.getAllFeatures();
    
    // Validar rutas duplicadas
    const paths = new Set<string>();
    features.forEach(feature => {
      feature.routes.forEach(route => {
        if (route.path && paths.has(route.path)) {
          errors.push(`Duplicate route path: ${route.path} in feature ${feature.name}`);
        }
        if (route.path) paths.add(route.path);
      });
    });
    
    // Validar dependencias circulares
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const hasCycle = (featureName: string): boolean => {
      if (recursionStack.has(featureName)) return true;
      if (visited.has(featureName)) return false;
      
      visited.add(featureName);
      recursionStack.add(featureName);
      
      const feature = this.features.get(featureName);
      if (feature?.dependencies) {
        for (const dep of feature.dependencies) {
          if (hasCycle(dep)) return true;
        }
      }
      
      recursionStack.delete(featureName);
      return false;
    };
    
    features.forEach(feature => {
      if (hasCycle(feature.name)) {
        errors.push(`Circular dependency detected in feature: ${feature.name}`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}