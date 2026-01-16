import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  nombre = '';
  email = '';
  mensaje = '';

  enviarFormulario(): void {
    if (this.nombre && this.email && this.mensaje) {
      alert('¡Gracias por tu mensaje! Te responderemos pronto.');
      this.nombre = '';
      this.email = '';
      this.mensaje = '';
    } else {
      alert('Por favor completa todos los campos');
    }
  }
}
