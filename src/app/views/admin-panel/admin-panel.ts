import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../services/product';
import { CompanyService, Nosotros, TituloDescripcion } from '../../services/company.service';
import { finalize } from 'rxjs/operators';

interface ProductoForm {
  nombre: string;
  precio: number | '';
  descripcion: string;
  imagen: string;
}

interface NosotrosForm {
  imagen: string;
  titulo_temp: string;
  descripcion_temp: string;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  // PRODUCTOS
  productos: any[] = [];
  editandoId: string | null = null;
  cargando: boolean = false;
  
  formulario: ProductoForm = {
    nombre: '',
    precio: '',
    descripcion: '',
    imagen: ''
  };

  // NOSOTROS (Una sola imagen + múltiples títulos/descripciones)
  nosotros: Nosotros | null = null;
  cargandoNosotros: boolean = false;
  editandoNosotros: boolean = false;
  
  formularioNosotros: NosotrosForm = {
    imagen: '',
    titulo_temp: '',
    descripcion_temp: ''
  };
  editandoItemIndex: number | null = null;

  private productService = inject(Product);
  private companyService = inject(CompanyService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarNosotros();
  }

  // ============ PRODUCTOS ============

  cargarProductos(): void {
    this.cargando = true;
    this.productService
      .getFresh()
      .pipe(finalize(() => {
        this.cargando = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (data) => {
          this.productos = [...(data ?? [])];
          this.cdr.markForCheck();
        },
        error: () => {
          alert('No pudimos cargar los productos. Intenta de nuevo.');
          this.cdr.markForCheck();
        },
      });
  }

  manejarEnvio(): void {
    if (!this.formulario.nombre || !this.formulario.precio || !this.formulario.descripcion) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const objetoProducto = {
      nombre: this.formulario.nombre,
      precio: Number(this.formulario.precio),
      descripcion: this.formulario.descripcion,
      imagen: this.formulario.imagen
    };

    if (this.editandoId) {
      this.productService.update(this.editandoId, objetoProducto).subscribe({
        next: () => {
          alert('¡Producto actualizado!');
          this.cancelarEdicion();
          this.cargarProductos();
        },
        error: () => {
          alert('Error al actualizar el producto');
        }
      });
    } else {
      this.productService.create(objetoProducto).subscribe({
        next: () => {
          alert('¡Producto creado!');
          this.cancelarEdicion();
          this.cargarProductos();
        },
        error: () => {
          alert('Error al crear el producto');
        }
      });
    }
  }

  prepararEdicion(producto: any): void {
    this.editandoId = producto.id;
    this.formulario = {
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      imagen: producto.imagen || ''
    };
    window.scrollTo(0, 0);
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.formulario = {
      nombre: '',
      precio: '',
      descripcion: '',
      imagen: ''
    };
  }

  eliminarProducto(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          alert('Eliminado correctamente');
          this.cargarProductos();
        },
        error: () => {
          alert('No se pudo eliminar el producto');
        }
      });
    }
  }

  // ============ NOSOTROS ============

  cargarNosotros(): void {
    this.cargandoNosotros = true;
    this.companyService.getFresh().subscribe({
      next: (data) => {
        this.nosotros = data;
        this.cargandoNosotros = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargandoNosotros = false;
        this.cdr.markForCheck();
      }
    });
  }

  editarNosotros(): void {
    this.editandoNosotros = true;
    
    // Si no existe nosotros, inicializar uno vacío
    if (!this.nosotros) {
      this.nosotros = {
        imagen: '',
        titulos_descripciones: []
      };
    }
    
    // Copiar la imagen al formulario
    this.formularioNosotros = {
      imagen: this.nosotros.imagen || '',
      titulo_temp: '',
      descripcion_temp: ''
    };
    
    window.scrollTo(0, 0);
  }

  agregarTituloDescripcion(): void {
    if (!this.formularioNosotros.titulo_temp || !this.formularioNosotros.descripcion_temp) {
      alert('Por favor completa título y descripción');
      return;
    }

    if (!this.nosotros) {
      this.nosotros = {
        imagen: this.formularioNosotros.imagen,
        titulos_descripciones: []
      };
    }

    if (!this.nosotros.titulos_descripciones) {
      this.nosotros.titulos_descripciones = [];
    }

    const nuevoTituloDesc: TituloDescripcion = {
      titulo: this.formularioNosotros.titulo_temp,
      descripcion: this.formularioNosotros.descripcion_temp
    };

    // Si estamos editando un ítem, reemplazar; si no, agregar
    if (this.editandoItemIndex !== null) {
      this.nosotros.titulos_descripciones[this.editandoItemIndex] = nuevoTituloDesc;
      this.editandoItemIndex = null;
    } else {
      this.nosotros.titulos_descripciones.push(nuevoTituloDesc);
    }
    this.formularioNosotros.titulo_temp = '';
    this.formularioNosotros.descripcion_temp = '';
    this.cdr.markForCheck();
  }

  eliminarTituloDescripcion(index: number): void {
    if (this.nosotros && this.nosotros.titulos_descripciones && confirm('¿Eliminar este título y descripción?')) {
      this.nosotros.titulos_descripciones.splice(index, 1);
      this.cdr.markForCheck();
    }
  }

  prepararEdicionTituloDescripcion(index: number): void {
    if (!this.nosotros || !this.nosotros.titulos_descripciones) return;
    const item = this.nosotros.titulos_descripciones[index];
    this.formularioNosotros.titulo_temp = item.titulo;
    this.formularioNosotros.descripcion_temp = item.descripcion;
    this.editandoItemIndex = index;
    window.scrollTo(0, 0);
  }

  guardarNosotros(): void {
    // Inicializar objeto si no existe
    if (!this.nosotros) {
      this.nosotros = { imagen: '', titulos_descripciones: [] };
    }

    // Validar imagen
    if (!this.formularioNosotros.imagen) {
      alert('Por favor completa la imagen');
      return;
    }

    // Si hay datos temporales sin agregar, agrégalos automáticamente
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

    // Actualizar la imagen
    this.nosotros.imagen = this.formularioNosotros.imagen;

    const accion$ = this.nosotros.id ? this.companyService.update(this.nosotros) : this.companyService.create(this.nosotros);

    accion$.subscribe({
      next: () => {
        alert('¡Información actualizada!');
        this.cancelarEdicionNosotros();
        this.cargarNosotros();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Error al guardar. Intenta de nuevo.');
      }
    });
  }

  cancelarEdicionNosotros(): void {
    this.editandoNosotros = false;
    this.formularioNosotros = {
      imagen: '',
      titulo_temp: '',
      descripcion_temp: ''
    };
  }

  // Método para manejar la carga de imágenes
  onImageSelected(event: any, tipo: string): void {
    const file: File = event.target.files[0];
    
    if (!file) return;
    
    // Validar tamaño (máx 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('La imagen es demasiado grande. Máximo 5MB');
      return;
    }
    
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }
    
    // Leer la imagen y convertirla a base64 o URL
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (tipo === 'nosotros') {
        this.formularioNosotros.imagen = e.target.result;
      }
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }
}
