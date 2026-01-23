import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface TituloDescripcion {
  titulo: string;
  descripcion: string;
}

export interface Nosotros {
  id?: string;
  imagen: string;
  titulos_descripciones: TituloDescripcion[];
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);
  private readonly API_URL = 'http://localhost:8080/api/nosotros';
  private readonly KEY = makeStateKey<Nosotros>('nosotros-cache');

  // Obtener información de Nosotros
  getAll(): Observable<Nosotros> {
    const isBrowser = isPlatformBrowser(this.platformId);

    if (isBrowser && this.transferState.hasKey(this.KEY)) {
      const cached = this.transferState.get(this.KEY, {} as Nosotros);
      this.transferState.remove(this.KEY);
      return of(cached);
    }

    return this.http.get<Nosotros>(this.API_URL).pipe(
      tap((nosotros) => {
        if (!isBrowser) {
          this.transferState.set(this.KEY, nosotros);
        }
      }),
    );
  }

  // Actualizar información de Nosotros
  update(nosotros: Nosotros): Observable<Nosotros> {
    const id = nosotros.id || '1';
    return this.http.put<Nosotros>(`${this.API_URL}/${id}`, nosotros).pipe(
      tap(() => this.transferState.remove(this.KEY))
    );
  }

  // Crear información de Nosotros (cuando no existe aún)
  create(nosotros: Nosotros): Observable<Nosotros> {
    return this.http.post<Nosotros>(this.API_URL, nosotros).pipe(
      tap(() => this.transferState.remove(this.KEY))
    );
  }

  // Obtener sin cache (para admin)
  getFresh(): Observable<Nosotros> {
    return this.http.get<Nosotros>(this.API_URL);
  }
}
