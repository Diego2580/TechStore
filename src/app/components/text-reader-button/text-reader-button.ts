import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityService } from '../../services/accessibility.service';

@Component({
  selector: 'app-text-reader-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (showButton()) {
      <button class="btn btn-primary btn-sm rounded-pill shadow-smreader-btn fw-bold d-flex align-items-center gap-2 pe-3"
              [style.top.px]="topPos()"
              [style.left.px]="leftPos()"
              (mousedown)="speak($event)">
         @if(!service.isSpeaking()) {
           <i class="bi bi-megaphone-fill"></i> Escuchar
         } @else {
           <i class="bi bi-stop-fill"></i> Detener
         }
      </button>
    }
  `,
  styles: [`
    .reader-btn {
      position: fixed;
      z-index: 1060;
      transform: translate(-50%, -120%); /* Centrar y poner encima */
      animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 2px solid white;
    }
    @keyframes popIn {
      from { opacity: 0; transform: translate(-50%, -100%) scale(0.8); }
      to { opacity: 1; transform: translate(-50%, -120%) scale(1); }
    }
  `]
})
export class TextReaderButton {
  service = inject(AccessibilityService);

  // Mostrar solo si TTS está activo, hay texto y hay coordenadas
  showButton = computed(() => 
    this.service.state().ttsEnabled && 
    !!this.service.selectedText() && 
    !!this.service.selectionRect()
  );

  // Calcular posición (encima de la selección)
  topPos = computed(() => (this.service.selectionRect()?.top ?? 0) + window.scrollY);
  leftPos = computed(() => {
    const rect = this.service.selectionRect();
    return rect ? rect.left + (rect.width / 2) : 0;
  });

  speak(event: Event) {
    event.preventDefault(); // Evitar que el clic deseleccione el texto
    event.stopPropagation();
    if(this.service.isSpeaking()) {
      this.service.stopSpeaking();
    } else {
      this.service.speakSelection();
    }
  }
}