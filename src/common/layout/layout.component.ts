// src/common/layout/layout.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, Router, RouterLinkActive, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { MenuItem } from '../services/route-config.service';
import { MenuBuilderService, MenuContext } from '../services/menu-builder.service';
import { FeatureFactory } from '../factories/feature.factory';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink,
    RouterLinkActive,
    CommonModule, 
    HeaderComponent, 
    BreadcrumbComponent
  ]
})
export class LayoutComponent implements OnInit {
  private menuBuilderService = inject(MenuBuilderService);
  private router = inject(Router);

  isCollapsed = false;
  isExpandedOnHover = false;
  
  // Signals para reactive updates
  menuItems = signal<MenuItem[]>([]);
  expandedMenuItems = signal<Set<string>>(new Set());

  ngOnInit() {
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    // Obtener items del menú desde la factory
    const rawMenuItems = FeatureFactory.getAllMenuItems();
    
    // Agregar item de Home manualmente
    const homeMenuItem: MenuItem = {
      label: 'Home',
      icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
      path: '/',
      order: 1
    };

    const allMenuItems = [homeMenuItem, ...rawMenuItems];
    
    // Construir menú con contexto del usuario
    const menuContext: MenuContext = {
      userRoles: ['admin', 'user'], // Esto vendría del servicio de autenticación
      permissions: {
        '/users': true,
        '/dashboard': true,
        '/settings': false
      }
    };
    
    const processedMenu = this.menuBuilderService.buildMenu(allMenuItems, menuContext);
    this.menuItems.set(processedMenu);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  onMouseEnter() {
    if (this.isCollapsed) {
      this.isExpandedOnHover = true;
    }
  }

  onMouseLeave() {
    if (this.isCollapsed) {
      this.isExpandedOnHover = false;
    }
  }

  onMenuItemClick() {
    if (this.isCollapsed) {
      this.isExpandedOnHover = false;
    }
  }

  toggleMenuItem(label: string) {
    const expanded = this.expandedMenuItems();
    const newExpanded = new Set(expanded);
    
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    
    this.expandedMenuItems.set(newExpanded);
  }

  isMenuItemExpanded(label: string): boolean {
    return this.expandedMenuItems().has(label);
  }

  // Método para navegar programáticamente
  navigateTo(path: string) {
    this.router.navigate([path]);
    this.onMenuItemClick();
  }

  // Método para recargar el menú (útil para cambios dinámicos)
  reloadMenu() {
    this.initializeMenuItems();
  }

  // Método para obtener el breadcrumb de la ruta actual
  getCurrentBreadcrumb(): MenuItem[] {
    const currentPath = this.router.url;
    return this.menuBuilderService.getBreadcrumb(this.menuItems(), currentPath);
  }
}