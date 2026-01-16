import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  estaAutenticado = signal(false);
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Cargar estado desde localStorage solo en el navegador
    if (this.isBrowser) {
      const savedAuth = localStorage.getItem('estaAutenticado');
      if (savedAuth === 'true') {
        this.estaAutenticado.set(true);
      }
    }
  }

  login(usuario: string, password: string): boolean {
    // Validación con credenciales específicas
    if (usuario === 'diego' && password === 'diego123') {
      this.estaAutenticado.set(true);
      if (this.isBrowser) {
        localStorage.setItem('estaAutenticado', 'true');
      }
      return true;
    }
    return false;
  }

  logout(): void {
    this.estaAutenticado.set(false);
    if (this.isBrowser) {
      localStorage.removeItem('estaAutenticado');
    }
  }

  isAuthenticated(): boolean {
    return this.estaAutenticado();
  }
}
