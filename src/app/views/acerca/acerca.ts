import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-acerca',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acerca.html',
  styleUrls: ['./acerca.css']
})
export class Acerca implements OnInit {
  cargando = true;
  nosotros: any = null;
  error: string | null = null;

  constructor(private companyService: CompanyService) {}

  ngOnInit() {
    this.cargarNosotros();
  }

  cargarNosotros() {
    this.companyService.obtenerNosotros().subscribe({
      next: (data) => {
        this.nosotros = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando información', err);
        this.error = 'No pudimos cargar la información. Intenta de nuevo.';
        this.cargando = false;
        // Fallback con datos locales
        this.nosotros = {
          imagen: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          titulos_descripciones: [
            { titulo: 'Innovación Constante', descripcion: 'Buscamos siempre lo último en hardware para ti.' },
            { titulo: 'Compromiso Total', descripcion: 'Tu satisfacción es nuestra métrica más importante.' },
            { titulo: 'Calidad Garantizada', descripcion: 'Solo trabajamos con marcas certificadas mundialmente.' }
          ]
        };
      }
    });
  }
}