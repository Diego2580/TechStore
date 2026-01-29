import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    exclude: ['node_modules', 'dist', '.angular'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
      ]
    }
  },
  resolve: {
    alias: {
      '@angular/core/testing': '@angular/core/testing',
      '@angular/common/http/testing': '@angular/common/http/testing',
    }
  }
});
