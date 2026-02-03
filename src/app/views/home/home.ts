import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimatedBackground } from '../../components/animated-background/animated-background';
import { Product } from '../../services/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, AnimatedBackground],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  cargando = false;
  productos: any[] = [];
  error: string | null = null;
  private productService = inject(Product);
  private cargado = false;

  ngOnInit() {
    // Solo cargar si no se ha cargado antes
    if (!this.cargado) {
      this.cargarProductos();
      this.cargado = true;
    }
  }

  cargarProductos() {
    this.cargando = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.productos = data || [];
        this.cargando = false;
        this.error = null;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.error = 'No pudimos cargar los productos. Intenta de nuevo.';
        this.cargando = false;
        // Fallback con datos por defecto si la API falla
        this.productos = [
          { id: 1, nombre: 'RTX 4090 Gaming OC', descripcion: '24GB GDDR6X, Arquitectura Ada Lovelace', precio: 1899, imagen: 'https://m.media-amazon.com/images/I/7122hH4+9JL._AC_SL1500_.jpg' },
          { id: 2, nombre: 'Intel Core i9-14900K', descripcion: '24 núcleos, hasta 6.0 GHz, Socket LGA1700', precio: 629, imagen: 'https://m.media-amazon.com/images/I/61p6cM8i4ZL._AC_SL1200_.jpg' },
          { id: 3, nombre: 'Monitor Odyssey G9', descripcion: '49" OLED Curvo, 240Hz, 0.03ms', precio: 1299, imagen: 'https://m.media-amazon.com/images/I/6125mFrzr6L._AC_SL1000_.jpg' },
          { id: 4, nombre: 'MacBook Pro M3 Max', descripcion: 'Chip M3 Max, 36GB RAM, 1TB SSD', precio: 3199, imagen: 'https://m.media-amazon.com/images/I/618d5bS2lUL._AC_SL1500_.jpg' }
        ];
      }
    });
  }
}