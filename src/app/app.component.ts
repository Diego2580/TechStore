import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
// Importamos el nuevo componente
import { AccessibilityPanel } from './components/accessibility-panel/accessibility-panel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Footer, AccessibilityPanel],
  template: `
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>

    <app-navbar></app-navbar>

    <main id="main-content" role="main" tabindex="-1">
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
    
    <app-accessibility-panel></app-accessibility-panel>
  `
})
export class App {}