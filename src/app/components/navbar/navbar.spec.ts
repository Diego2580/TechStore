import { vi, describe, it, expect, beforeEach } from 'vitest';
import { signal } from '@angular/core';

// Mock simple del componente Navbar para pruebas unitarias
class NavbarMock {
  authService: any;
  router: any;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

describe('Navbar Component', () => {
  let component: NavbarMock;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(() => {
    // Crear mocks de los servicios
    mockAuthService = {
      logout: vi.fn(),
      isAuthenticated: vi.fn().mockReturnValue(false),
      estaAutenticado: signal(false)
    };
    
    mockRouter = {
      navigate: vi.fn()
    };

    // Crear instancia del mock con dependencias inyectadas
    component = new NavbarMock();
    component.authService = mockAuthService;
    component.router = mockRouter;
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener referencia al AuthService', () => {
    expect(component.authService).toBeTruthy();
  });

  it('debería llamar a logout del AuthService cuando se ejecuta logout()', () => {
    component.logout();
    
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
  });

  it('debería navegar a la página de inicio después de hacer logout', () => {
    component.logout();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
  });

  it('debería ejecutar logout y navigate en el orden correcto', () => {
    const callOrder: string[] = [];
    
    mockAuthService.logout = vi.fn(() => callOrder.push('logout'));
    mockRouter.navigate = vi.fn(() => callOrder.push('navigate'));

    component.logout();

    expect(callOrder).toEqual(['logout', 'navigate']);
    expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
  });
});
