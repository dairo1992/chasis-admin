import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent]
})
export class LayoutComponent {
  isCollapsed = false;
  isExpandedOnHover = false;

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
}