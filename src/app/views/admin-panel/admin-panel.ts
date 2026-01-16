import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../services/product';
import { CompanyService, CompanyInfo } from '../../services/company.service';
import { finalize } from 'rxjs/operators';

interface ProductoForm {
  nombre: string;
  precio: number | '';
  descripcion: string;
  imagen: string;
}

interface NosotrosForm {
  titulo1: string;
  descripcion1: string;
  titulo2: string;
  descripcion2: string;
  imagen: string;
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

  // NOSOTROS
  nosotros: CompanyInfo | null = null;
  cargandoNosotros: boolean = false;
  editandoNosotros: boolean = false;
  
  formularioNosotros: NosotrosForm = {
    titulo1: '',
    descripcion1: '',
    titulo2: '',
    descripcion2: '',
    imagen: ''
  };

  private productService = inject(Product);
  private companyService = inject(CompanyService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarNosotros();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.productService
      .getFresh() // Usar getFresh() para obtener datos actualizados sin cache
      .pipe(finalize(() => {
        this.cargando = false;
        this.cdr.markForCheck(); // Forzar detección de cambios
      }))
      .subscribe({
        next: (data) => {
          console.log('Productos cargados:', data);
          this.productos = [...(data ?? [])]; // Crear nuevo array para forzar detección de cambios
          this.cdr.markForCheck(); // Forzar detección de cambios
        },
        error: (err) => {
          console.error('Error al cargar productos:', err);
          alert('No pudimos cargar los productos. Intenta de nuevo.');
          this.cdr.markForCheck(); // Forzar detección de cambios incluso en error
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
      // PUT - Actualizar
      this.productService.update(this.editandoId, objetoProducto).subscribe({
        next: (productoActualizado) => {
          alert('¡Producto actualizado!');
          this.cancelarEdicion();
          // Recargar la lista completa desde el servidor
          this.cargarProductos();
        },
        error: (err) => {
          alert('Error al actualizar el producto');
        }
      });
    } else {
      // POST - Crear
      this.productService.create(objetoProducto).subscribe({
        next: (nuevoProducto) => {
          alert('¡Producto creado!');
          this.cancelarEdicion();
          // Recargar la lista completa desde el servidor
          this.cargarProductos();
        },
        error: (err) => {
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
          // Recargar la lista completa desde el servidor
          this.cargarProductos();
        },
        error: (err) => {
          alert('No se pudo eliminar el producto');
        }
      });
    }
  }

  // ============ MÉTODOS PARA NOSOTROS ============

  cargarNosotros(): void {
    this.cargandoNosotros = true;
    this.companyService.getFresh().subscribe({
      next: (data) => {
        this.nosotros = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.cargandoNosotros = false;
        this.cdr.markForCheck();
      },
      complete: () => {
        this.cargandoNosotros = false;
        this.cdr.markForCheck();
      }
    });
  }

  editarNosotros(): void {
    if (this.nosotros) {
      this.editandoNosotros = true;
      this.formularioNosotros = {
        titulo1: this.nosotros.titulo1,
        descripcion1: this.nosotros.descripcion1,
        titulo2: this.nosotros.titulo2,
        descripcion2: this.nosotros.descripcion2,
        imagen: this.nosotros.imagen
      };
      window.scrollTo(0, 0);
    }
  }

  guardarNosotros(): void {
    if (!this.formularioNosotros.titulo1 || !this.formularioNosotros.descripcion1 || !this.formularioNosotros.titulo2 || !this.formularioNosotros.descripcion2) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const datosActualizados: CompanyInfo = {
      id: this.nosotros?.id,
      titulo1: this.formularioNosotros.titulo1,
      descripcion1: this.formularioNosotros.descripcion1,
      titulo2: this.formularioNosotros.titulo2,
      descripcion2: this.formularioNosotros.descripcion2,
      imagen: this.formularioNosotros.imagen
    };

    this.companyService.upsert(datosActualizados).subscribe({
      next: () => {
        alert('¡Información actualizada!');
        this.cancelarEdicionNosotros();
        this.cargarNosotros();
      },
      error: (err) => {
        alert('Error al actualizar la información');
      }
    });
  }

  cancelarEdicionNosotros(): void {
    this.editandoNosotros = false;
    this.formularioNosotros = {
      titulo1: '',
      descripcion1: '',
      titulo2: '',
      descripcion2: '',
      imagen: ''
    };
  }
}
