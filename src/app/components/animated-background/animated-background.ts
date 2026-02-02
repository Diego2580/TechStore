import { Component, Input, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityService } from '../../services/accessibility.service';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

@Component({
  selector: 'app-animated-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="background-container" aria-hidden="true">
      
      <div class="absolute-fill bg-gradient" [ngClass]="gradientClass()"></div>
      
      <div class="absolute-fill">
        <div class="nebula nebula-1" [class.animate-pulse-slow]="!reduceMotion()"></div>
        <div class="nebula nebula-2" [class.animate-pulse-slower]="!reduceMotion()"></div>
        <div class="nebula nebula-3" [class.animate-pulse-slow]="!reduceMotion()"></div>
      </div>

      <div class="absolute-fill">
        @for (star of stars; track star.id) {
          <div class="star"
               [class.animate-twinkle]="!reduceMotion()"
               [style.left.%]="star.x"
               [style.top.%]="star.y"
               [style.width.px]="star.size"
               [style.height.px]="star.size"
               [style.opacity]="star.opacity"
               [style.animation-duration.s]="star.duration"
               [style.animation-delay.s]="star.delay">
          </div>
        }
      </div>

      @if (!reduceMotion()) {
        <div class="absolute-fill overflow-hidden">
          <div class="shooting-star" style="top: 20%; animation-delay: 0s;"></div>
          <div class="shooting-star" style="top: 40%; animation-delay: 3s;"></div>
          <div class="shooting-star" style="top: 60%; animation-delay: 6s;"></div>
        </div>
      }

      @if (showRobot) {
        <div class="robot-container" [class.animate-float]="!reduceMotion()">
           <img src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Robot IA" 
                class="robot-img" />
        </div>
      }

      <div class="absolute-fill grid-overlay"></div>

      <div class="absolute-fill vignette"></div>
      
    </div>
  `,
  styles: [`
    .background-container {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      overflow: hidden;
      pointer-events: none; /* Importante para que no bloquee clicks */
      z-index: 0;
    }
    .absolute-fill {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
    }
    
    /* Gradientes por variante */
    .bg-gradient { transition: background 1s ease; }
    .grad-hero { background: linear-gradient(to bottom right, #0a0d1a, #1a1040, #0d1025); }
    .grad-services { background: linear-gradient(to bottom right, #0d1025, #15082a, #0a0d1a); }
    .grad-contact { background: linear-gradient(to bottom right, #0a0d1a, #1a1040, #15082a); }
    
    /* Nebulosas */
    .nebula { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; }
    .nebula-1 { top: 20%; left: -10%; width: 600px; height: 600px; background: rgba(147, 51, 234, 0.2); } /* Púrpura */
    .nebula-2 { bottom: 20%; right: -10%; width: 500px; height: 500px; background: rgba(37, 99, 235, 0.2); } /* Azul */
    .nebula-3 { top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; height: 400px; background: rgba(6, 182, 212, 0.1); } /* Cyan */

    /* Estrellas */
    .star { position: absolute; background: white; border-radius: 50%; }

    /* Robot */
    .robot-container {
      position: absolute;
      right: 5%; top: 20%;
      width: 400px; height: 500px;
      opacity: 0.4;
      mix-blend-mode: screen; /* Efecto holográfico */
      mask-image: radial-gradient(ellipse 70% 70% at center, black 40%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse 70% 70% at center, black 40%, transparent 70%);
    }
    .robot-img { width: 100%; height: 100%; object-fit: contain; }

    /* Grid y Viñeta */
    .grid-overlay {
      background-image: 
        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0.5;
    }
    .vignette {
      background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%);
    }

    /* Ajustes Responsive para el robot */
    @media (max-width: 768px) {
      .robot-container { opacity: 0.2; width: 250px; right: -50px; }
    }
  `]
})
export class AnimatedBackground implements OnInit {
  @Input() variant: 'hero' | 'services' | 'contact' = 'hero';
  @Input() showRobot = false;

  service = inject(AccessibilityService);
  reduceMotion = computed(() => this.service.state().reduceMotion);
  
  stars: Star[] = [];

  ngOnInit() {
    this.generateStars();
  }

  gradientClass() {
    switch (this.variant) {
      case 'services': return 'grad-services';
      case 'contact': return 'grad-contact';
      default: return 'grad-hero';
    }
  }

  private generateStars() {
    this.stars = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1, // 1px a 3px
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 3 + 2, // 2s a 5s
      delay: Math.random() * 5
    }));
  }
}