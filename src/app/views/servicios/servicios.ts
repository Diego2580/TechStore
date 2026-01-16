import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios {
  servicios = [
    { icon: 'bi-wrench', title: 'Soporte Técnico', desc: 'Asistencia profesional 24/7' },
    { icon: 'bi-truck', title: 'Envío Express', desc: 'Entrega en 24-48 horas' },
    { icon: 'bi-shield-check', title: 'Garantía Extendida', desc: 'Protección de tus productos' },
    { icon: 'bi-arrow-repeat', title: 'Cambios y Devoluciones', desc: 'Sin complicaciones' }
  ];
}
