import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiciosService, Servicio } from '../../services/servicios.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios implements OnInit {
  servicios: Servicio[] = [];
  private serviciosService = inject(ServiciosService);

  ngOnInit() {
    this.serviciosService.getServicios().subscribe(servicios => {
      this.servicios = servicios;
    });
  }
}
