import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CompanyInfo {
  id?: string;
  titulo1: string;
  descripcion1: string;
  titulo2: string;
  descripcion2: string;
  imagen: string;
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);
  private readonly API_URL = 'https://6942ca8269b12460f312d514.mockapi.io/nosotros';
  private readonly KEY = makeStateKey<CompanyInfo>('nosotros-cache');

  getInfo(): Observable<CompanyInfo> {
    const isBrowser = isPlatformBrowser(this.platformId);

    if (isBrowser && this.transferState.hasKey(this.KEY)) {
      const cached = this.transferState.get(this.KEY, this.empty());
      this.transferState.remove(this.KEY);
      return of(cached);
    }

    return this.http.get<CompanyInfo[]>(this.API_URL).pipe(
      switchMap((list) => {
        const found = list?.[0];
        if (found) return of(found);
        const fallback = this.empty();
        return this.http.post<CompanyInfo>(this.API_URL, fallback).pipe(
          catchError(() => of(fallback)),
        );
      }),
      tap((data) => {
        if (!isBrowser) {
          this.transferState.set(this.KEY, data ?? this.empty());
        }
      }),
    );
  }

  upsert(info: CompanyInfo): Observable<CompanyInfo> {
    if (info.id) {
      return this.http.put<CompanyInfo>(`${this.API_URL}/${info.id}`, info).pipe(
        tap(() => {
          // Limpiar caché después de actualizar
          this.transferState.remove(this.KEY);
        })
      );
    }
    return this.http.post<CompanyInfo>(this.API_URL, info).pipe(
      tap(() => {
        // Limpiar caché después de crear
        this.transferState.remove(this.KEY);
      })
    );
  }

  /**
   * Obtener información frescos sin cache (para admin)
   */
  getFresh(): Observable<CompanyInfo> {
    return this.http.get<CompanyInfo[]>(this.API_URL).pipe(
      switchMap((list) => {
        const found = list?.[0];
        if (found) return of(found);
        return of(this.empty());
      }),
    );
  }

  private empty(): CompanyInfo {
    return {
      id: '1',
      titulo1: '',
      descripcion1: 'Cargando...',
      titulo2: '',
      descripcion2: 'Cargando...',
      imagen: 'https://via.placeholder.com/400',
    };
  }
}
