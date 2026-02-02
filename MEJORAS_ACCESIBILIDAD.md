# ♿ MEJORAS DE ACCESIBILIDAD - TechStore

## 1. Servicio de Accesibilidad (State Management)

Crea un servicio para manejar el estado de las preferencias del usuario. Este servicio inyectará clases CSS en el `<body>` dinámicamente.

**Archivo:** `src/app/services/accessibility.service.ts`

```typescript
import { Injectable, signal, effect, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  // Estados reactivos con Signals
  highContrast = signal(false);
  largeText = signal(false);
  dyslexicFont = signal(false);
  colorBlindMode = signal<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>('none');

  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    // Efecto: Aplica clases al body cuando cambian los signals
    effect(() => {
      const body = document.body;
      
      // Alto Contraste
      if (this.highContrast()) {
        this.renderer.addClass(body, 'high-contrast');
      } else {
        this.renderer.removeClass(body, 'high-contrast');
      }

      // Texto Grande
      if (this.largeText()) {
        this.renderer.addClass(body, 'large-text');
      } else {
        this.renderer.removeClass(body, 'large-text');
      }

      // Fuente Dislexia
      if (this.dyslexicFont()) {
        this.renderer.addClass(body, 'dyslexic-font');
      } else {
        this.renderer.removeClass(body, 'dyslexic-font');
      }

      // Modos Daltonismo (limpiar anteriores y aplicar nuevo)
      ['protanopia', 'deuteranopia', 'tritanopia'].forEach(mode => 
        this.renderer.removeClass(body, `mode-${mode}`)
      );
      if (this.colorBlindMode() !== 'none') {
        this.renderer.addClass(body, `mode-${this.colorBlindMode()}`);
      }
    });
  }

  toggleHighContrast() { this.highContrast.update(v => !v); }
  toggleLargeText() { this.largeText.update(v => !v); }
  toggleDyslexicFont() { this.dyslexicFont.update(v => !v); }
  setColorBlindMode(mode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') {
    this.colorBlindMode.set(mode);
  }
}
```

## 2. Estilos Globales (CSS)

Agrega esto a tu `src/styles.css`. Usamos variables CSS para facilitar el cambio de temas y filtros SVG para daltonismo.

**Archivo:** `src/styles.css`

```css
/* --- Variables por defecto --- */
:root {
  --primary-color: #0d6efd;
  --bg-color: #ffffff;
  --text-color: #212529;
  --link-color: #0d6efd;
  --border-color: #dee2e6;
}

/* --- 1. Alto Contraste --- */
body.high-contrast {
  --primary-color: #ffff00 !important; /* Amarillo sobre negro */
  --bg-color: #000000 !important;
  --text-color: #ffffff !important;
  --link-color: #809fff !important;
  --border-color: #ffffff !important;
  
  background-color: var(--bg-color) !important;
  color: var(--text-color) !important;
}

/* Forzar estilos en componentes Bootstrap */
body.high-contrast .card, 
body.high-contrast .navbar, 
body.high-contrast .modal-content,
body.high-contrast .bg-light,
body.high-contrast .bg-white {
  background-color: #000 !important;
  border: 2px solid #fff !important;
  color: #fff !important;
}

body.high-contrast a {
  text-decoration: underline !important;
  color: var(--link-color) !important;
}

body.high-contrast button.btn-primary {
  background-color: #000 !important;
  border: 2px solid #ff0 !important;
  color: #ff0 !important;
  font-weight: bold;
}

/* --- 2. Texto Grande --- */
body.large-text {
  font-size: 125% !important;
}

/* --- 3. Fuente Amigable para Dislexia --- */
body.dyslexic-font {
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif !important;
  line-height: 1.6 !important;
  letter-spacing: 0.05em !important;
}

/* --- 4. Filtros para Daltonismo --- */
/* Aplica filtros SVG definidos en index.html */
body.mode-protanopia { filter: url('#protanopia-filter'); }
body.mode-deuteranopia { filter: url('#deuteranopia-filter'); }
body.mode-tritanopia { filter: url('#tritanopia-filter'); }

/* --- 5. Indicador de foco visible (Crucial para navegación por teclado) --- */
:focus-visible {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
}
```

## 3. Filtros SVG (Index.html)

Para que los filtros de daltonismo funcionen, necesitamos definirlos en el HTML.

**Archivo:** `src/index.html` (Agregar justo antes de cerrar `</body>`)

```html
<!-- Filtros SVG para accesibilidad visual -->
<svg style="display: none;">
  <defs>
    <!-- Filtro para Protanopia (Rojos débiles) -->
    <filter id="protanopia-filter">
      <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0
                                           0.558, 0.442, 0, 0, 0
                                           0, 0.242, 0.758, 0, 0
                                           0, 0, 0, 1, 0" />
    </filter>
    <!-- Filtro para Deuteranopia (Verdes débiles) -->
    <filter id="deuteranopia-filter">
      <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0
                                           0.7, 0.3, 0, 0, 0
                                           0, 0.3, 0.7, 0, 0
                                           0, 0, 0, 1, 0" />
    </filter>
    <!-- Filtro para Tritanopia (Azules débiles) -->
    <filter id="tritanopia-filter">
      <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0
                                           0, 0.433, 0.567, 0, 0
                                           0, 0.475, 0.525, 0, 0
                                           0, 0, 0, 1, 0" />
    </filter>
  </defs>
</svg>
```

## 4. Componente de Control de Accesibilidad

Crea este componente y agrégalo en tu `app.component.html` o `header.html`.

**Archivo:** `src/app/components/accessibility-widget/accessibility-widget.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityService } from '../../services/accessibility.service';

@Component({
  selector: 'app-accessibility-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
      <button class="btn btn-primary rounded-circle p-3 shadow" 
              (click)="isOpen = !isOpen"
              aria-label="Opciones de Accesibilidad"
              [attr.aria-expanded]="isOpen">
        <i class="bi bi-universal-access-circle fs-4"></i> ♿
      </button>

      @if (isOpen) {
        <div class="card shadow p-3 mt-2 mb-5" role="dialog" aria-label="Menú de accesibilidad">
          <h6 class="fw-bold">Accesibilidad</h6>
          
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" id="highContrast"
                   [checked]="accService.highContrast()"
                   (change)="accService.toggleHighContrast()">
            <label class="form-check-label" for="highContrast">Alto Contraste</label>
          </div>

          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" id="largeText"
                   [checked]="accService.largeText()"
                   (change)="accService.toggleLargeText()">
            <label class="form-check-label" for="largeText">Texto Grande</label>
          </div>

          <div class="mb-2">
            <label class="form-label small fw-bold">Modo Daltonismo:</label>
            <select class="form-select form-select-sm" 
                    [value]="accService.colorBlindMode()"
                    (change)="changeColorMode($event)">
              <option value="none">Normal</option>
              <option value="protanopia">Protanopia (Rojo)</option>
              <option value="deuteranopia">Deuteranopia (Verde)</option>
              <option value="tritanopia">Tritanopia (Azul)</option>
            </select>
          </div>
        </div>
      }
    </div>
  `
})
export class AccessibilityWidget {
  accService = inject(AccessibilityService);
  isOpen = false;

  changeColorMode(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.accService.setColorBlindMode(select.value as any);
  }
}
```