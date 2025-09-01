// src/common/components/breadcrumb/breadcrumb.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { MenuBuilderService } from '../../services/menu-builder.service';
import { FeatureFactory } from '../../factories/feature.factory';

export interface BreadcrumbItem {
    label: string;
    path?: string;
    icon?: string;
}

@Component({
    selector: 'app-breadcrumb',
    template: `
    <div class="breadcrumbs text-sm">
      <ul>
        @for (item of breadcrumbItems(); track item.label) {
          <li>
            @if (item.path && item.path !== currentPath()) {
              <a [routerLink]="item.path" class="link link-hover">
                @if (item.icon) {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                       stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="item.icon" />
                  </svg>
                }
                {{ item.label }}
              </a>
            } @else {
              <span class="text-base-content/70">
                @if (item.icon) {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                       stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="item.icon" />
                  </svg>
                }
                {{ item.label }}
              </span>
            }
          </li>
        }
      </ul>
    </div>
  `,
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class BreadcrumbComponent implements OnInit {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private menuBuilderService = inject(MenuBuilderService);

    breadcrumbItems = signal<BreadcrumbItem[]>([]);
    currentPath = signal<string>('');

    ngOnInit() {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this.buildBreadcrumb())
            )
            .subscribe(breadcrumb => {
                this.breadcrumbItems.set(breadcrumb);
                this.currentPath.set(this.router.url);
            });

        // Inicializar breadcrumb
        this.breadcrumbItems.set(this.buildBreadcrumb());
        this.currentPath.set(this.router.url);
    }

    private buildBreadcrumb(): BreadcrumbItem[] {
        const menuItems = FeatureFactory.getAllMenuItems();
        const currentPath = this.router.url;

        // Obtener breadcrumb del menu builder
        const menuBreadcrumb = this.menuBuilderService.getBreadcrumb(menuItems, currentPath);

        // Si no encontramos breadcrumb en el menú, construir desde la ruta
        if (menuBreadcrumb.length === 0) {
            return this.buildBreadcrumbFromRoute();
        }

        // Convertir MenuItem[] a BreadcrumbItem[]
        return menuBreadcrumb.map(item => ({
            label: item.label,
            path: item.path,
            icon: item.icon
        }));
    }

    private buildBreadcrumbFromRoute(): BreadcrumbItem[] {
        const breadcrumb: BreadcrumbItem[] = [];
        const pathSegments = this.router.url.split('/').filter(segment => segment);

        // Siempre empezar con Home
        breadcrumb.push({
            label: 'Home',
            path: '/',
            icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
        });

        // Construir breadcrumb desde los segmentos de la URL
        let currentPath = '';
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`;

            // Capitalizar y limpiar el segmento
            const label = this.formatSegmentLabel(segment);

            breadcrumb.push({
                label,
                path: currentPath
            });
        });

        return breadcrumb;
    }

    private formatSegmentLabel(segment: string): string {
        // Si es un ID numérico, mostrar como "Detalle"
        if (/^\d+$/.test(segment)) {
            return 'Detalle';
        }

        // Convertir de kebab-case a título
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}