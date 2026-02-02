import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Servicio {
  icon: string;
  title: string;
  desc: string;
  badge?: string;
}

@Injectable({ providedIn: 'root' })
export class ServiciosService {
  private servicios$ = new BehaviorSubject<Servicio[]>([
    { 
      icon: 'bi-wrench', 
      title: 'Soporte Técnico', 
      desc: 'Asistencia profesional 24/7',
      badge: 'Siempre Online'
    },
    { 
      icon: 'bi-truck', 
      title: 'Envío Express', 
      desc: 'Entrega en 24-48 horas',
      badge: 'Rápido'
    },
    { 
      icon: 'bi-shield-check', 
      title: 'Garantía Extendida', 
      desc: 'Protección de tus productos',
      badge: '3 Años'
    },
    { 
      icon: 'bi-arrow-repeat', 
      title: 'Cambios y Devoluciones', 
      desc: 'Sin complicaciones',
      badge: 'Fácil'
    }
  ]);

  getServicios(): Observable<Servicio[]> {
    return this.servicios$.asObservable();
  }

  actualizarServicios(servicios: Servicio[]): void {
    this.servicios$.next(servicios);
  }

  obtenerServiciosActuales(): Servicio[] {
    return this.servicios$.value;
  }
}
