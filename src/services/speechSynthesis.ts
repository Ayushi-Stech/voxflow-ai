import { VoiceSettings } from '../types';

export interface TTSCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export class SpeechSynthesisService {
  private voices: SpeechSynthesisVoice[] = [];
  private isSpeaking: boolean = false;
  private settings: VoiceSettings = {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    selectedVoiceURI: '',
    autoSpeak: true,
    soundEffects: true,
    continuousMode: false,
  };

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const load = () => {
      this.voices = window.speechSynthesis.getVoices();
    };

    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && typeof window !== 'undefined' && window.speechSynthesis) {
      this.voices = window.speechSynthesis.getVoices();
    }
    return this.voices;
  }

  public updateSettings(settings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...settings };
  }

  public getSettings(): VoiceSettings {
    return this.settings;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public speak(text: string, callbacks?: TTSCallbacks): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      if (!this.settings.autoSpeak) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.stop();

      const cleanText = text
        .replace(/[*_#`~]/g, '') // remove markdown artifacts
        .replace(/₹/g, ' rupees ')
        .replace(/\$/g, ' dollars ');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;
      utterance.volume = this.settings.volume;

      // Select voice if available
      const voices = this.getVoices();
      if (this.settings.selectedVoiceURI) {
        const found = voices.find((v) => v.voiceURI === this.settings.selectedVoiceURI);
        if (found) utterance.voice = found;
      } else {
        // Preferred natural voices: Google English, Microsoft Jenny / Guy / Natural, or standard English
        const preferred = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
             v.name.includes('Google') ||
             v.name.includes('Samantha') ||
             v.name.includes('Daniel') ||
             v.name.includes('Karen'))
        ) || voices.find((v) => v.lang.startsWith('en'));

        if (preferred) utterance.voice = preferred;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        callbacks?.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        callbacks?.onError?.(e);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }
}

export const ttsService = new SpeechSynthesisService();

