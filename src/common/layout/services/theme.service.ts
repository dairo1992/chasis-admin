import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal('garden');
  platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.theme.set(savedTheme);
      }
      document.documentElement.setAttribute('data-theme', this.theme());
    }
  }

  toggleTheme() {
    const newTheme = this.theme() === 'garden' ? 'abyss' : 'garden';
    this.theme.set(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', newTheme);
    }
  }
}