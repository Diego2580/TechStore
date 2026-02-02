import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
// IMPORTANTE: Usamos el nuevo servicio de accesibilidad
import { AccessibilityService } from '../../services/accessibility.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  authService = inject(AuthService);
  accService = inject(AccessibilityService); // Inyección corregida
  router = inject(Router);

  // Getter para usar en el HTML
  isDark() {
    return this.accService.darkMode();
  }

  toggleTheme() {
    this.accService.toggleDarkMode();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}