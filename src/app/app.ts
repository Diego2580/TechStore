import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { AccessibilityPanel } from './components/accessibility-panel/accessibility-panel';
// IMPORTANTE: Importar el botón lector
import { TextReaderButton } from './components/text-reader-button/text-reader-button';

@Component({
  selector: 'app-root',
  standalone: true,
  // IMPORTANTE: Añadirlo a la lista de imports
  imports: [CommonModule, RouterOutlet, Navbar, Footer, AccessibilityPanel, TextReaderButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'TechStore';
}