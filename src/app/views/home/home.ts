import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  productos: any[] = [];
  cargando = true;
  private productService = inject(Product);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        this.cdr.markForCheck(); // Forzar detección de cambios
      },
      error: (err) => {
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }
}
