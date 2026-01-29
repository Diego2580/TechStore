import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería crear el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería inicializar con estaAutenticado en false cuando no hay token', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('debería realizar login exitosamente y guardar token en localStorage', async () => {
    const mockResponse = {
      token: 'test-token-123',
      user: { id: 1, username: 'testuser' }
    };

    const result = await new Promise<boolean>((resolve) => {
      service.login('testuser', 'password123').subscribe((res) => {
        expect(res).toBe(true);
        expect(service.isAuthenticated()).toBe(true);
        expect(localStorage.getItem('auth_token')).toBe('test-token-123');
        expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockResponse.user));
        resolve(res);
      });

      const req = httpMock.expectOne(`${environment.backendBaseUrl}/api/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'testuser', password: 'password123' });
      req.flush(mockResponse);
    });

    expect(result).toBe(true);
  });

  it('debería realizar registro exitosamente', async () => {
    const result = await new Promise<boolean>((resolve) => {
      service.register('newuser', 'newpass123').subscribe((res) => {
        expect(res).toBe(true);
        resolve(res);
      });

      const req = httpMock.expectOne(`${environment.backendBaseUrl}/api/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'newuser', password: 'newpass123' });
      req.flush({});
    });

    expect(result).toBe(true);
  });

  it('debería hacer logout y limpiar localStorage', () => {
    // Simular que el usuario está autenticado
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify({ id: 1, username: 'testuser' }));
    service.estaAutenticado.set(true);

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });

  it('debería retornar true en isAuthenticated cuando el usuario está logueado', async () => {
    const mockResponse = {
      token: 'test-token-456',
      user: { id: 2, username: 'testuser2' }
    };

    const result = await new Promise<boolean>((resolve) => {
      service.login('testuser2', 'pass456').subscribe(() => {
        expect(service.isAuthenticated()).toBe(true);
        resolve(true);
      });

      const req = httpMock.expectOne(`${environment.backendBaseUrl}/api/auth/login`);
      req.flush(mockResponse);
    });

    expect(result).toBe(true);
  });
});
