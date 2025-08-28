import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  theme = signal('cupcake');

  toggleTheme() {
    const newTheme = this.theme() === 'cupcake' ? 'abyss' : 'cupcake';
    this.theme.set(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}