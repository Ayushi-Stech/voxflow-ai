export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private callbacks: SpeechRecognitionCallbacks = {};
  private silenceTimer: any = null;
  private latestInterim: string = '';
  private continuousMode: boolean = false;

  constructor() {
    this.initRecognition();
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public setContinuousMode(enabled: boolean) {
    this.continuousMode = enabled;
  }

  public getContinuousMode(): boolean {
    return this.continuousMode;
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true; // Use continuous recognition for fluid conversation
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        if (finalTranscript) {
          this.clearSilenceTimer();
          this.latestInterim = '';
          this.callbacks.onResult?.(finalTranscript.trim(), true);
        } else if (interimTranscript) {
          this.latestInterim = interimTranscript.trim();
          this.callbacks.onResult?.(this.latestInterim, false);

          // Fast silence debounce: if user speaks a command and pauses for 1.2s, treat as final command!
          this.clearSilenceTimer();
          this.silenceTimer = setTimeout(() => {
            if (this.latestInterim && this.latestInterim.length > 2) {
              const textToDispatch = this.latestInterim;
              this.latestInterim = '';
              this.callbacks.onResult?.(textToDispatch, true);
            }
          }, 1200);
        }
      };

      this.recognition.onerror = (event: any) => {
        let message = event.error;
        if (event.error === 'not-allowed') {
          message = 'Microphone permission denied. Please allow mic access in your browser.';
        } else if (event.error === 'no-speech') {
          // Normal background silence, ignore in continuous mode
          return;
        }
        this.callbacks.onError?.(message);
      };

      this.recognition.onend = () => {
        this.clearSilenceTimer();
        this.isListening = false;
        this.stopAudioStream();
        this.callbacks.onEnd?.();
      };
    }
  }

  private clearSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  public setCallbacks(callbacks: SpeechRecognitionCallbacks) {
    this.callbacks = callbacks;
  }

  public async startListening(): Promise<boolean> {
    if (!this.recognition) {
      this.callbacks.onError?.('Web Speech API is not supported in this browser. Try Google Chrome or Microsoft Edge.');
      return false;
    }

    try {
      await this.startAudioStream();
      this.recognition.start();
      return true;
    } catch (err: any) {
      if (err.name !== 'InvalidStateError') {
        this.callbacks.onError?.(err.message || 'Failed to start microphone.');
      }
      return false;
    }
  }

  public stopListening() {
    this.clearSilenceTimer();
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.stopAudioStream();
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  private async startAudioStream() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioCtx();
        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        source.connect(this.analyser);
      }
    } catch (e) {}
  }

  private stopAudioStream() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
    this.analyser = null;
  }

  public getAudioFrequencyData(): Uint8Array | null {
    if (!this.analyser) return null;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const speechService = new SpeechRecognitionService();
