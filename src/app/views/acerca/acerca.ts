import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  ngOnInit() {
    // Simulación de carga de datos para que no salga error en el HTML
    setTimeout(() => {
      this.nosotros = {
        imagen: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        titulos_descripciones: [
          { titulo: 'Innovación Constante', descripcion: 'Buscamos siempre lo último en hardware para ti.' },
          { titulo: 'Compromiso Total', descripcion: 'Tu satisfacción es nuestra métrica más importante.' },
          { titulo: 'Calidad Garantizada', descripcion: 'Solo trabajamos con marcas certificadas mundialmente.' }
        ]
      };
      this.cargando = false;
    }, 1000);
  }
}