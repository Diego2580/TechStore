import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Primero, inicializar el entorno de pruebas de Angular.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Mock de localStorage para entorno de pruebas
const localStorageMock: { [key: string]: string; getItem: (key: string) => string | null; setItem: (key: string, value: string) => void; removeItem: (key: string) => void; clear: () => void } = {
  getItem: (key: string): string | null => {
    return (localStorageMock as any)[key] || null;
  },
  setItem: (key: string, value: string): void => {
    (localStorageMock as any)[key] = value;
  },
  removeItem: (key: string): void => {
    delete (localStorageMock as any)[key];
  },
  clear: (): void => {
    Object.keys(localStorageMock).forEach((key) => {
      if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
        delete (localStorageMock as any)[key];
      }
    });
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
