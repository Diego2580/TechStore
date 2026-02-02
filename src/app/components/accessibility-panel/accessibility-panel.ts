import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AccessibilityService } from '../../services/accessibility.service';

@Component({
  selector: 'app-accessibility-panel',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './accessibility-panel.html',
  styleUrls: ['./accessibility-panel.css']
})
export class AccessibilityPanel {
  service = inject(AccessibilityService);
  isOpen = false;

  // Getter para usar 's' en el HTML
  get s() {
    return this.service.state();
  }

  togglePanel() {
    this.isOpen = !this.isOpen;
  }

  // Helpers para los eventos del HTML
  onSaturationChange(e: Event) { this.service.setSaturation(+(e.target as HTMLInputElement).value); }
  onLetterSpacingChange(e: Event) { this.service.setLetterSpacing(+(e.target as HTMLInputElement).value); }
  onWordSpacingChange(e: Event) { this.service.setWordSpacing(+(e.target as HTMLInputElement).value); }
  onLineHeightChange(e: Event) { this.service.setLineHeight(+(e.target as HTMLInputElement).value); }
  onTtsSpeedChange(e: Event) { this.service.setTtsSpeed(+(e.target as HTMLInputElement).value); }
  onVoiceChange(e: Event) { this.service.setTtsVoice(+(e.target as HTMLSelectElement).value); }
}