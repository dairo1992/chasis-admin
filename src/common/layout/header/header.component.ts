import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  get theme() {
    return this.themeService.theme;
  }
}
