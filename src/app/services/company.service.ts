import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, shareReplay, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
  private readonly API_URL = `${environment.backendBaseUrl}/api/nosotros`;
  private cache: Nosotros | null = null;
  private cacheTimer: any = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private nosotrosCache$: Observable<Nosotros> | null = null;

  // Obtener información de Nosotros
  obtenerNosotros(): Observable<Nosotros> {
    return this.getAll();
  }

  getAll(): Observable<Nosotros> {
    // Si hay caché y es válido, devolverlo
    if (this.cache !== null && this.cacheTimer) {
      return of(this.cache);
    }

    // Si hay una petición en progreso, devolverla
    if (this.nosotrosCache$) {
      return this.nosotrosCache$;
    }

    // Nueva petición
    this.nosotrosCache$ = this.http.get<Nosotros>(this.API_URL).pipe(
      tap(data => {
        this.cache = data;
        if (this.cacheTimer) clearTimeout(this.cacheTimer);
        this.cacheTimer = setTimeout(() => {
          this.cache = null;
          this.nosotrosCache$ = null;
        }, this.CACHE_DURATION);
      }),
      catchError(err => {
        this.nosotrosCache$ = null;
        return throwError(() => err);
      }),
      shareReplay(1)
    );

    return this.nosotrosCache$;
  }

  // Actualizar información de Nosotros
  update(nosotros: Nosotros): Observable<Nosotros> {
    const id = nosotros.id || '1';
    return this.http.put<Nosotros>(`${this.API_URL}/${id}`, nosotros).pipe(
      tap(() => {
        this.cache = null;
        this.nosotrosCache$ = null;
        if (this.cacheTimer) clearTimeout(this.cacheTimer);
      })
    );
  }

  // Crear información de Nosotros (cuando no existe aún)
  create(nosotros: Nosotros): Observable<Nosotros> {
    return this.http.post<Nosotros>(this.API_URL, nosotros).pipe(
      tap(() => {
        this.cache = null;
        this.nosotrosCache$ = null;
        if (this.cacheTimer) clearTimeout(this.cacheTimer);
      })
    );
  }

  // Obtener sin cache (para admin)
  getFresh(): Observable<Nosotros> {
    this.cache = null;
    this.nosotrosCache$ = null;
    if (this.cacheTimer) clearTimeout(this.cacheTimer);

    return this.http.get<Nosotros>(this.API_URL).pipe(
      tap(data => {
        this.cache = data;
        if (this.cacheTimer) clearTimeout(this.cacheTimer);
        this.cacheTimer = setTimeout(() => {
          this.cache = null;
          this.nosotrosCache$ = null;
        }, this.CACHE_DURATION);
      })
    );
  }
}
