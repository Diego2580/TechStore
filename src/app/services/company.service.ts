import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);
  private readonly API_URL = `${environment.backendBaseUrl}/api/nosotros`;
  private readonly KEY = makeStateKey<Nosotros>('nosotros-cache');

  // Obtener información de Nosotros
  getAll(): Observable<Nosotros> {
    // Siempre hacer petición HTTP fresca - el TransferState causaba problemas con cache vacío
    return this.http.get<Nosotros>(this.API_URL);
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
