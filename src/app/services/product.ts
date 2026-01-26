import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/core';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);
  private readonly API_URL = `${environment.backendBaseUrl}/api/productos`;
  private readonly PRODUCTS_KEY = makeStateKey<any[]>('productos-cache');

  getAll(): Observable<any[]> {
    // Siempre hacer petición HTTP fresca - el TransferState causaba problemas con cache vacío
    return this.http.get<any[]>(this.API_URL);
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
