import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  estaAutenticado = signal(false);
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Cargar estado desde localStorage solo en el navegador
    if (this.isBrowser) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.estaAutenticado.set(true);
      }
    }
  }

  register(usuario: string, password: string): Observable<boolean> {
    return this.http
      .post(`${this.API_URL}/register`, { username: usuario, password })
      .pipe(map(() => true));
  }

  login(usuario: string, password: string): Observable<boolean> {
    return this.http
      .post<{ token: string; user: { id: number; username: string } }>(
        `${this.API_URL}/login`,
        { username: usuario, password }
      )
      .pipe(
        tap((res) => {
          this.estaAutenticado.set(true);
          if (this.isBrowser) {
            localStorage.setItem('auth_token', res.token);
            localStorage.setItem('auth_user', JSON.stringify(res.user));
          }
        }),
        map(() => true)
      );
  }

  logout(): void {
    this.estaAutenticado.set(false);
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  isAuthenticated(): boolean {
    return this.estaAutenticado();
  }
}
