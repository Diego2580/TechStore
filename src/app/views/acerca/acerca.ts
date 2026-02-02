import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService, TituloDescripcion } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';

interface NosotrosForm {
  imagen: string;
  titulo_temp: string;
  descripcion_temp: string;
}

@Component({
  selector: 'app-acerca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acerca.html',
  styleUrls: ['./acerca.css']
})
export class Acerca implements OnInit {
  cargando = true;
  nosotros: any = null;
  error: string | null = null;
  
  // Edición
  editando = false;
  formularioNosotros: NosotrosForm = {
    imagen: '',
    titulo_temp: '',
    descripcion_temp: ''
  };
  editandoItemIndex: number | null = null;

  private companyService = inject(CompanyService);
  public authService = inject(AuthService);

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

  // Métodos de edición
  iniciarEdicion(): void {
    this.editando = true;
    this.formularioNosotros = {
      imagen: this.nosotros?.imagen || '',
      titulo_temp: '',
      descripcion_temp: ''
    };
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.formularioNosotros = {
      imagen: '',
      titulo_temp: '',
      descripcion_temp: ''
    };
    this.editandoItemIndex = null;
  }

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (!file) return;
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('La imagen es demasiado grande. Máximo 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.formularioNosotros.imagen = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  agregarTituloDescripcion(): void {
    if (!this.formularioNosotros.titulo_temp || !this.formularioNosotros.descripcion_temp) {
      alert('Por favor completa título y descripción');
      return;
    }

    if (!this.nosotros) {
      this.nosotros = { imagen: this.formularioNosotros.imagen, titulos_descripciones: [] };
    }

    if (!this.nosotros.titulos_descripciones) {
      this.nosotros.titulos_descripciones = [];
    }

    const nuevoTituloDesc: TituloDescripcion = {
      titulo: this.formularioNosotros.titulo_temp,
      descripcion: this.formularioNosotros.descripcion_temp
    };

    if (this.editandoItemIndex !== null) {
      this.nosotros.titulos_descripciones[this.editandoItemIndex] = nuevoTituloDesc;
      this.editandoItemIndex = null;
    } else {
      this.nosotros.titulos_descripciones.push(nuevoTituloDesc);
    }
    
    this.formularioNosotros.titulo_temp = '';
    this.formularioNosotros.descripcion_temp = '';
  }

  eliminarTituloDescripcion(index: number): void {
    if (this.nosotros && this.nosotros.titulos_descripciones && confirm('¿Eliminar este título y descripción?')) {
      this.nosotros.titulos_descripciones.splice(index, 1);
    }
  }

  prepararEdicionTituloDescripcion(index: number): void {
    if (!this.nosotros || !this.nosotros.titulos_descripciones) return;
    const item = this.nosotros.titulos_descripciones[index];
    this.formularioNosotros.titulo_temp = item.titulo;
    this.formularioNosotros.descripcion_temp = item.descripcion;
    this.editandoItemIndex = index;
  }

  guardarNosotros(): void {
    if (!this.nosotros) {
      this.nosotros = { imagen: '', titulos_descripciones: [] };
    }

    if (!this.formularioNosotros.imagen) {
      alert('Por favor completa la imagen');
      return;
    }

    if (this.formularioNosotros.titulo_temp && this.formularioNosotros.descripcion_temp) {
      const pendiente: TituloDescripcion = {
        titulo: this.formularioNosotros.titulo_temp,
        descripcion: this.formularioNosotros.descripcion_temp,
      };
      if (!this.nosotros.titulos_descripciones) this.nosotros.titulos_descripciones = [];
      this.nosotros.titulos_descripciones.push(pendiente);
      this.formularioNosotros.titulo_temp = '';
      this.formularioNosotros.descripcion_temp = '';
      this.editandoItemIndex = null;
    }

    if (!this.nosotros.titulos_descripciones || this.nosotros.titulos_descripciones.length === 0) {
      alert('Por favor agrega al menos un título/descripción');
      return;
    }

    this.nosotros.imagen = this.formularioNosotros.imagen;

    const accion$ = this.nosotros.id ? this.companyService.update(this.nosotros) : this.companyService.create(this.nosotros);

    accion$.subscribe({
      next: () => {
        alert('¡Información actualizada!');
        this.cancelarEdicion();
        this.cargarNosotros();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Error al guardar. Intenta de nuevo.');
      }
    });
  }
}