import { Injectable, signal, Inject, PLATFORM_ID, effect, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface A11yState {
  darkMode: boolean;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  largeCursor: boolean;
  underlineLinks: boolean;
  readingGuide: boolean;
  saturation: number;
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;
  ttsEnabled: boolean;
  ttsSpeed: number;
  ttsVoiceIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private readonly STORAGE_KEY = 'techstore_a11y_v2';
  isBrowser: boolean;
  
  // === ESTADO PRINCIPAL ===
  state = signal<A11yState>({
    darkMode: false, highContrast: false, largeText: false, reduceMotion: false,
    largeCursor: false, underlineLinks: false, readingGuide: false,
    saturation: 1, letterSpacing: 0, wordSpacing: 0, lineHeight: 1.6,
    ttsEnabled: false, ttsSpeed: 1, ttsVoiceIndex: 0
  });

  // === COMPATIBILIDAD CON NAVBAR (IMPORTANTE) ===
  // Esto arregla el error en navbar.ts
  darkMode = computed(() => this.state().darkMode);
  
  toggleDarkMode() {
    this.toggle('darkMode');
  }

  // === AUDIO / TTS ===
  private synth: SpeechSynthesis | null = null;
  availableVoices = signal<SpeechSynthesisVoice[]>([]);
  isSpeaking = signal(false);
  isPaused = signal(false);
  selectedText = signal<string>('');
  selectionRect = signal<DOMRect | null>(null);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.loadPreferences();
      this.initSpeechSynthesis();
      this.setupReadingGuideListener();
      this.setupSelectionListener();
    }

    // Efecto maestro
    effect(() => {
      if (!this.isBrowser) return;
      const s = this.state();
      const body = document.body;
      const html = document.documentElement;

      body.classList.toggle('dark-theme', s.darkMode);
      body.classList.toggle('high-contrast', s.highContrast);
      body.classList.toggle('reduce-motion', s.reduceMotion);
      body.classList.toggle('large-cursor', s.largeCursor);
      body.classList.toggle('underline-links', s.underlineLinks);
      body.classList.toggle('show-reading-guide', s.readingGuide);

      html.style.setProperty('--saturation', s.saturation.toString());
      body.style.setProperty('--font-size-base', s.largeText ? '1.25rem' : '1rem');
      body.style.setProperty('--letter-spacing', s.letterSpacing > 0 ? `${s.letterSpacing}px` : 'normal');
      body.style.setProperty('--word-spacing', s.wordSpacing > 0 ? `${s.wordSpacing}px` : 'normal');
      body.style.setProperty('--line-height', s.lineHeight.toString());

      this.savePreferences();
    });
  }

  toggle(prop: keyof A11yState) {
    if (typeof this.state()[prop] === 'boolean') {
       this.state.update(s => ({ ...s, [prop]: !s[prop] }));
    }
  }

  setSaturation(val: number) { this.state.update(s => ({ ...s, saturation: val })); }
  setLetterSpacing(val: number) { this.state.update(s => ({ ...s, letterSpacing: val })); }
  setWordSpacing(val: number) { this.state.update(s => ({ ...s, wordSpacing: val })); }
  setLineHeight(val: number) { this.state.update(s => ({ ...s, lineHeight: val })); }
  
  setTtsSpeed(val: number) {
    this.state.update(s => ({ ...s, ttsSpeed: val }));
    if (this.isSpeaking()) { this.speak(this.lastSpokenText); }
  }
  setTtsVoice(index: number) {
    this.state.update(s => ({ ...s, ttsVoiceIndex: index }));
     if (this.isSpeaking()) { this.speak(this.lastSpokenText); }
  }

  resetAll() {
    this.stopSpeaking();
    this.state.set({
      darkMode: false, highContrast: false, largeText: false, reduceMotion: false,
      largeCursor: false, underlineLinks: false, readingGuide: false,
      saturation: 1, letterSpacing: 0, wordSpacing: 0, lineHeight: 1.6,
      ttsEnabled: false, ttsSpeed: 1, ttsVoiceIndex: 0
    });
    this.selectedText.set('');
    this.selectionRect.set(null);
  }

  private loadPreferences() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.state.update(s => ({ ...s, ...parsed }));
      } catch (e) {
        console.error('Error loading a11y prefs', e);
      }
    }
  }

  private savePreferences() {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state()));
    }
  }

  private setupReadingGuideListener() {
    if (!this.isBrowser) return;
    const guide = document.getElementById('reading-guide');
    if (guide) {
      document.addEventListener('mousemove', (e) => {
        if (this.state().readingGuide) {
          guide.style.top = `${e.clientY}px`;
        }
      }, { passive: true });
    }
  }

  private setupSelectionListener() {
     if (!this.isBrowser) return;
     document.addEventListener('selectionchange', () => {
       const selection = window.getSelection();
       const text = selection?.toString().trim();

       if (text && text.length > 2 && this.state().ttsEnabled) {
         this.selectedText.set(text);
         try {
           const range = selection!.getRangeAt(0);
           const rect = range.getBoundingClientRect();
           this.selectionRect.set(rect);
         } catch(e) {
           this.selectionRect.set(null);
         }
       } else {
         this.selectedText.set('');
         this.selectionRect.set(null);
       }
     });
  }

  // === TTS LOGIC ===
  private lastSpokenText = '';

  private initSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      let voices = this.synth.getVoices();
      if (voices.length > 0) {
          this.availableVoices.set(voices);
      }
      this.synth.onvoiceschanged = () => {
          if (this.synth) { // Null check
             this.availableVoices.set(this.synth.getVoices());
          }
      };
      
      const interval = setInterval(() => {
         if(this.synth) {
             this.isSpeaking.set(this.synth.speaking);
             this.isPaused.set(this.synth.paused);
         }
      }, 500);
    }
  }

  speak(text: string) {
    if (!this.synth || !text) return;
    this.stopSpeaking();
    this.lastSpokenText = text;

    const utterance = new SpeechSynthesisUtterance(text);
    const s = this.state();
    utterance.rate = s.ttsSpeed;
    
    const voices = this.availableVoices();
    if (voices[s.ttsVoiceIndex]) {
      utterance.voice = voices[s.ttsVoiceIndex];
    }

    utterance.onend = () => {
        this.isSpeaking.set(false);
        this.isPaused.set(false);
    };

    this.synth.speak(utterance);
    this.isSpeaking.set(true);
  }

  speakSelection() {
    const text = this.selectedText();
    if (text) this.speak(text);
  }
  
  speakPage() {
    const mainContent = document.querySelector('main')?.innerText;
    if(mainContent) this.speak(mainContent);
  }

  pauseSpeaking() { this.synth?.pause(); this.isPaused.set(true); }
  resumeSpeaking() { this.synth?.resume(); this.isPaused.set(false); }
  stopSpeaking() { this.synth?.cancel(); this.isSpeaking.set(false); this.isPaused.set(false); }
}