import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'https://6942ca8269b12460f312d514.mockapi.io/productos';

  constructor(private http: HttpClient) {}

  // GET - Obtener todos los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URL);
  }

  // GET - Obtener un producto por ID
  getProducto(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URL}/${id}`);
  }

  // POST - Crear un nuevo producto
  crearProducto(producto: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http.post<Producto>(this.API_URL, producto);
  }

  // PUT - Actualizar un producto
  actualizarProducto(id: string, producto: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http.put<Producto>(`${this.API_URL}/${id}`, producto);
  }

  // DELETE - Eliminar un producto
  eliminarProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
