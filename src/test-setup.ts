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

// Interface para el mock de localStorage
interface LocalStorageMock {
  [key: string]: any;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

// Mock de localStorage para entorno de pruebas
const localStorageMock: LocalStorageMock = {
  getItem: (key: string): string | null => {
    return localStorageMock[key] || null;
  },
  setItem: (key: string, value: string): void => {
    localStorageMock[key] = value;
  },
  removeItem: (key: string): void => {
    delete localStorageMock[key];
  },
  clear: (): void => {
    Object.keys(localStorageMock).forEach((key) => {
      if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
        delete localStorageMock[key];
      }
    });
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
