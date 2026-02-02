import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.backendBaseUrl}/api/productos`;
  private cache: any[] | null = null;
  private cacheTimer: any = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private productCache$: Observable<any[]> | null = null;

  getAll(): Observable<any[]> {
    // Si hay caché y es válido, devolverlo
    if (this.cache !== null && this.cacheTimer) {
      return of(this.cache);
    }

    // Si hay una petición en progreso, devolverla
    if (this.productCache$) {
      return this.productCache$;
    }

    // Nueva petición
    this.productCache$ = this.http.get<any[]>(this.API_URL).pipe(
      tap(data => {
        this.cache = data;
        // Limpiar caché después de CACHE_DURATION
        if (this.cacheTimer) clearTimeout(this.cacheTimer);
        this.cacheTimer = setTimeout(() => {
          this.cache = null;
          this.productCache$ = null;
        }, this.CACHE_DURATION);
      }),
      catchError(err => {
        this.productCache$ = null;
        return throwError(() => err);
      }),
      shareReplay(1)
    );

    return this.productCache$;
  }

  /**
   * Obtener productos frescos sin cache (útil para admin panel)
   * Siempre hace una petición HTTP real al servidor
   */
  getFresh(): Observable<any[]> {
    // Limpiar caché
    this.cache = null;
    this.productCache$ = null;
    if (this.cacheTimer) clearTimeout(this.cacheTimer);

    return this.http.get<any[]>(this.API_URL).pipe(
      tap(data => {
        this.cache = data;
        if (this.cacheTimer) clearTimeout(this.cacheTimer);
        this.cacheTimer = setTimeout(() => {
          this.cache = null;
          this.productCache$ = null;
        }, this.CACHE_DURATION);
      })
    );
  }

  create(product: any): Observable<any> {
    return this.http.post<any>(this.API_URL, product);
  }

  update(id: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, product);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
