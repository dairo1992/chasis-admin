import { Injectable } from '@angular/core';
import { Route } from '@angular/router';

export interface MenuItem {
    label: string;
    icon: string;
    path?: string;
    children?: MenuItem[];
    order?: number;
    visible?: boolean;
}

export interface FeatureRoute extends Route {
    data?: {
        menuItem?: MenuItem;
        hideInMenu?: boolean;
    };
}

@Injectable({
    providedIn: 'root'
})
export class RouteConfigService {
    private routes: FeatureRoute[] = [];
    private menuItems: MenuItem[] = [];

    constructor() {
        this.initializeDefaultRoutes();
    }

    private initializeDefaultRoutes() {
        // Rutas por defecto del sistema
        const defaultRoutes: FeatureRoute[] = [
            {
                path: '',
                data: {
                    menuItem: {
                        label: 'Home',
                        icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
                        path: '/',
                        order: 1
                    }
                }
            }
        ];

        this.registerRoutes(defaultRoutes);
    }

    registerRoutes(routes: FeatureRoute[]) {
        routes.forEach(route => {
            this.routes.push(route);
            if (route.data?.menuItem && !route.data.hideInMenu) {
                this.menuItems.push(route.data.menuItem);
            }
        });

        // Ordenar por prioridad
        this.menuItems.sort((a, b) => (a.order || 999) - (b.order || 999));
    }

    getRoutes(): FeatureRoute[] {
        return this.routes;
    }

    getMenuItems(): MenuItem[] {
        return this.menuItems.filter(item => item.visible !== false);
    }

    addMenuItem(menuItem: MenuItem) {
        this.menuItems.push(menuItem);
        this.menuItems.sort((a, b) => (a.order || 999) - (b.order || 999));
    }

    removeMenuItem(path: string) {
        this.menuItems = this.menuItems.filter(item => item.path !== path);
    }

    updateMenuItem(path: string, updates: Partial<MenuItem>) {
        const item = this.menuItems.find(item => item.path === path);
        if (item) {
            Object.assign(item, updates);
        }
    }
}