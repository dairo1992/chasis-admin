// src/common/services/menu-builder.service.ts
import { Injectable } from '@angular/core';
import { MenuItem } from './route-config.service';

export interface MenuPermissions {
  [key: string]: boolean | string[];
}

export interface MenuContext {
  userRoles?: string[];
  permissions?: MenuPermissions;
  theme?: 'light' | 'dark';
}

@Injectable({
  providedIn: 'root'
})
export class MenuBuilderService {
  
  /**
   * Construye el menú basado en los items y el contexto del usuario
   */
  buildMenu(items: MenuItem[], context?: MenuContext): MenuItem[] {
    return items
      .filter(item => this.isItemVisible(item, context))
      .map(item => this.processMenuItem(item, context))
      .sort((a, b) => (a.order || 999) - (b.order || 999));
  }

  /**
   * Verifica si un item del menú debe ser visible
   */
  private isItemVisible(item: MenuItem, context?: MenuContext): boolean {
    // Verificar visibilidad básica
    if (item.visible === false) {
      return false;
    }

    // Verificar permisos si están definidos
    if (context?.permissions && item.path) {
      const permission = context.permissions[item.path];
      if (permission === false) {
        return false;
      }
      
      if (Array.isArray(permission) && context.userRoles) {
        return permission.some(role => context.userRoles!.includes(role));
      }
    }

    return true;
  }

  /**
   * Procesa un item del menú aplicando transformaciones
   */
  private processMenuItem(item: MenuItem, context?: MenuContext): MenuItem {
    const processedItem: MenuItem = { ...item };

    // Procesar children si existen
    if (item.children && item.children.length > 0) {
      processedItem.children = this.buildMenu(item.children, context);
    }

    // Aplicar transformaciones basadas en el contexto
    if (context?.theme === 'dark') {
      // Aplicar ajustes para tema oscuro si es necesario
    }

    return processedItem;
  }

  /**
   * Busca un item en el menú por path
   */
  findMenuItemByPath(items: MenuItem[], path: string): MenuItem | null {
    for (const item of items) {
      if (item.path === path) {
        return item;
      }
      
      if (item.children) {
        const found = this.findMenuItemByPath(item.children, path);
        if (found) {
          return found;
        }
      }
    }
    
    return null;
  }

  /**
   * Obtiene el breadcrumb para una ruta específica
   */
  getBreadcrumb(items: MenuItem[], path: string): MenuItem[] {
    const breadcrumb: MenuItem[] = [];
    
    const findPath = (items: MenuItem[], targetPath: string, currentPath: MenuItem[]): boolean => {
      for (const item of items) {
        const newPath = [...currentPath, item];
        
        if (item.path === targetPath) {
          breadcrumb.push(...newPath);
          return true;
        }
        
        if (item.children && findPath(item.children, targetPath, newPath)) {
          return true;
        }
      }
      
      return false;
    };

    findPath(items, path, []);
    return breadcrumb;
  }

  /**
   * Valida la estructura del menú
   */
  validateMenuStructure(items: MenuItem[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const paths = new Set<string>();

    const validateItem = (item: MenuItem, level = 0) => {
      // Validar campos requeridos
      if (!item.label) {
        errors.push(`Menu item at level ${level} missing label`);
      }
      
      if (!item.icon) {
        errors.push(`Menu item "${item.label}" missing icon`);
      }

      // Validar paths únicos
      if (item.path) {
        if (paths.has(item.path)) {
          errors.push(`Duplicate path found: ${item.path}`);
        }
        paths.add(item.path);
      }

      // Validar children
      if (item.children) {
        if (!Array.isArray(item.children)) {
          errors.push(`Menu item "${item.label}" children must be an array`);
        } else {
          item.children.forEach(child => validateItem(child, level + 1));
        }
      }
    };

    items.forEach(item => validateItem(item));

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convierte rutas planas a estructura jerárquica
   */
  buildHierarchicalMenu(flatItems: MenuItem[]): MenuItem[] {
    const hierarchy: MenuItem[] = [];
    const itemMap = new Map<string, MenuItem>();

    // Crear mapa de items
    flatItems.forEach(item => {
      if (item.path) {
        itemMap.set(item.path, { ...item, children: [] });
      }
    });

    // Construir jerarquía
    flatItems.forEach(item => {
      if (item.path) {
        const pathParts = item.path.split('/').filter(part => part);
        
        if (pathParts.length === 1) {
          // Item de nivel superior
          hierarchy.push(itemMap.get(item.path)!);
        } else {
          // Item anidado
          const parentPath = '/' + pathParts.slice(0, -1).join('/');
          const parent = itemMap.get(parentPath);
          
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(itemMap.get(item.path)!);
          }
        }
      }
    });

    return hierarchy;
  }
}