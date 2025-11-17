// src/common/layout/layout.component.ts
import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet, Router, RouterLinkActive, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { AlertComponent } from '../components/alert/alert.component';
import { MenuItem } from '../services/route-config.service';
import { MenuBuilderService, MenuContext } from '../services/menu-builder.service';
import { FeatureFactory } from '../factories/feature.factory';
import { LoginResponse } from '../../features/auth/interfaces/login-response.interface';
import { AuthService } from '../../features/auth/infrastructure/auth.service';

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
    BreadcrumbComponent,
    AlertComponent,
  ],
})
export class LayoutComponent {
  private menuBuilderService = inject(MenuBuilderService);
  private authService = inject(AuthService);
  private router = inject(Router);
  currentUser = signal<LoginResponse | null>(null);

  isCollapsed = false;
  isExpandedOnHover = false;

  // Signals para reactive updates
  menuItems = signal<MenuItem[]>([]);
  expandedMenuItems = signal<Set<string>>(new Set());

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      this.currentUser.set(user);
      this.buildDynamicMenu(user);
    });
  }

  private buildDynamicMenu(user: LoginResponse | null) {
    if (!user || !user.navigation) {
      this.menuItems.set([]);
      return;
    }

    const homeMenuItem: MenuItem = {
      label: 'Home',
      icon: 'tdesignHome',
      path: '/',
      order: 0, // Home should be first
    };

    const dynamicItems: MenuItem[] = user.navigation.map((navItem) => ({
      label: navItem.label || '',
      path: navItem.route || '',
      icon: navItem.icon || '', // Assuming icon is a string for now
      order: navItem.order || 99,
      // You can also map permissions if your menu logic uses them
      // permissions: navItem.permissions
    }));

    const allItems = [homeMenuItem, ...dynamicItems];

    // Sort items by order
    allItems.sort((a, b) => (a.order || 99) - (b.order || 99));

    this.menuItems.set(allItems);
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

  // Método para obtener el breadcrumb de la ruta actual
  getCurrentBreadcrumb(): MenuItem[] {
    const currentPath = this.router.url;
    return this.menuBuilderService.getBreadcrumb(this.menuItems(), currentPath);
  }

  logout() {
    this.authService.logout();
  }
}
