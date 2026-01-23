import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/core';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);
  private readonly API_URL = 'http://localhost:8080/api/productos';
  private readonly PRODUCTS_KEY = makeStateKey<any[]>('productos-cache');

  getAll(): Observable<any[]> {
    const isBrowser = isPlatformBrowser(this.platformId);

    // If running in the browser and we already have server-fetched data, reuse it to avoid double calls.
    if (isBrowser && this.transferState.hasKey(this.PRODUCTS_KEY)) {
      const cached = this.transferState.get(this.PRODUCTS_KEY, []);
      this.transferState.remove(this.PRODUCTS_KEY);
      return of(cached);
    }

    return this.http.get<any[]>(this.API_URL).pipe(
      tap((products) => {
        // Store server response so the client can hydrate without fetching again.
        if (!isBrowser) {
          this.transferState.set(this.PRODUCTS_KEY, products ?? []);
        }
      }),
    );
  }

  /**
   * Obtener productos frescos sin cache (útil para admin panel)
   * Siempre hace una petición HTTP real al servidor
   */
  getFresh(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
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
