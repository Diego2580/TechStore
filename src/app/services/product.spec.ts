import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from './product';
import { environment } from '../../environments/environment';

describe('Product Service', () => {
  let service: Product;
  let httpMock: HttpTestingController;
  const API_URL = `${environment.backendBaseUrl}/api/productos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Product]
    });
    
    service = TestBed.inject(Product);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todos los productos mediante getAll()', async () => {
    const mockProducts = [
      { id: 1, nombre: 'Laptop HP', precio: 800, descripcion: 'Laptop de alta gama' },
      { id: 2, nombre: 'Mouse Logitech', precio: 25, descripcion: 'Mouse inalámbrico' },
      { id: 3, nombre: 'Teclado Mecánico', precio: 120, descripcion: 'Teclado RGB' }
    ];

    const result = await new Promise<any[]>((resolve) => {
      service.getAll().subscribe((products) => {
        expect(products).toBeTruthy();
        expect(products.length).toBe(3);
        expect(products).toEqual(mockProducts);
        resolve(products);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    expect(result.length).toBe(3);
  });

  it('debería obtener productos frescos mediante getFresh()', async () => {
    const mockProducts = [
      { id: 1, nombre: 'Monitor Samsung', precio: 300, descripcion: '27 pulgadas' }
    ];

    const result = await new Promise<any[]>((resolve) => {
      service.getFresh().subscribe((products) => {
        expect(products).toBeTruthy();
        expect(products.length).toBe(1);
        expect(products[0].nombre).toBe('Monitor Samsung');
        resolve(products);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    expect(result[0].nombre).toBe('Monitor Samsung');
  });

  it('debería crear un nuevo producto mediante create()', async () => {
    const newProduct = {
      nombre: 'Webcam HD',
      precio: 80,
      descripcion: 'Webcam 1080p',
      imagen: 'webcam.jpg'
    };

    const mockResponse = { id: 4, ...newProduct };

    const result = await new Promise<any>((resolve) => {
      service.create(newProduct).subscribe((product) => {
        expect(product).toBeTruthy();
        expect(product.id).toBe(4);
        expect(product.nombre).toBe('Webcam HD');
        resolve(product);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(mockResponse);
    });

    expect(result.nombre).toBe('Webcam HD');
  });

  it('debería actualizar un producto existente mediante update()', async () => {
    const productId = '2';
    const updatedProduct = {
      nombre: 'Mouse Logitech MX Master',
      precio: 99,
      descripcion: 'Mouse ergonómico profesional'
    };

    const result = await new Promise<any>((resolve) => {
      service.update(productId, updatedProduct).subscribe((product) => {
        expect(product).toBeTruthy();
        expect(product.precio).toBe(99);
        resolve(product);
      });

      const req = httpMock.expectOne(`${API_URL}/${productId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush({ id: 2, ...updatedProduct });
    });

    expect(result.precio).toBe(99);
  });

  it('debería eliminar un producto mediante delete()', async () => {
    const productId = '3';

    await new Promise<void>((resolve) => {
      service.delete(productId).subscribe(() => {
        expect(true).toBe(true); // Confirmación de que se completó
        resolve();
      });

      const req = httpMock.expectOne(`${API_URL}/${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
