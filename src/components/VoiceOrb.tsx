import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Loader2 } from 'lucide-react';
import { speechService } from '../services/speechRecognition';

interface VoiceOrbProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  onToggleListen: () => void;
  statusText: string;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isListening,
  isProcessing,
  isSpeaking,
  onToggleListen,
  statusText,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const numBars = 36;
      const barWidth = 4;
      const spacing = (width - numBars * barWidth) / (numBars + 1);

      // Check real mic frequency if available
      const freqData = speechService.getAudioFrequencyData();

      for (let i = 0; i < numBars; i++) {
        let barHeight = 4; // base height

        if (isListening) {
          if (freqData && freqData.length > 0) {
            const index = Math.floor((i / numBars) * freqData.length);
            const val = freqData[index] || 0;
            barHeight = Math.max(6, (val / 255) * 60);
          } else {
            // Simulated acoustic bounce while listening
            const sinVal = Math.sin(phase + i * 0.35);
            barHeight = 10 + Math.abs(sinVal) * 35;
          }
        } else if (isSpeaking) {
          // Energetic voice synthesis output pattern
          const sinVal = Math.sin(phase * 1.5 + i * 0.5);
          barHeight = 12 + Math.abs(sinVal) * 45;
        } else if (isProcessing) {
          // Traveling wave pattern during LLM inference
          const sinVal = Math.sin(phase * 2 - i * 0.4);
          barHeight = 8 + Math.abs(sinVal) * 25;
        }

        const x = spacing + i * (barWidth + spacing);
        const y = centerY - barHeight / 2;

        // Gradient color for bars
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isListening) {
          gradient.addColorStop(0, '#34d399'); // emerald 400
          gradient.addColorStop(1, '#06b6d4'); // cyan 500
        } else if (isSpeaking) {
          gradient.addColorStop(0, '#a78bfa'); // violet 400
          gradient.addColorStop(1, '#ec4899'); // pink 500
        } else if (isProcessing) {
          gradient.addColorStop(0, '#fbbf24'); // amber 400
          gradient.addColorStop(1, '#f97316'); // orange 500
        } else {
          gradient.addColorStop(0, 'rgba(100, 116, 139, 0.4)');
          gradient.addColorStop(1, 'rgba(51, 65, 85, 0.2)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      phase += 0.08;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening, isSpeaking, isProcessing]);

  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      {/* Outer Glow Ring Layers */}
      <div className="relative flex items-center justify-center">
        {/* Layer 1: Ambient pulsating glow */}
        <div
          className={`absolute rounded-full transition-all duration-700 pointer-events-none ${
            isListening
              ? 'w-60 h-60 bg-emerald-500/25 blur-3xl animate-pulse'
              : isSpeaking
              ? 'w-60 h-60 bg-violet-500/25 blur-3xl animate-pulse'
              : isProcessing
              ? 'w-60 h-60 bg-amber-500/25 blur-3xl animate-pulse'
              : 'w-48 h-48 bg-emerald-500/10 blur-2xl'
          }`}
        />

        {/* Layer 2: Expanding Radar Ripples when recording */}
        {isListening && (
          <>
            <div className="absolute w-36 h-36 rounded-full border border-emerald-400/40 animate-ping pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full border border-cyan-400/30 animate-pulse pointer-events-none" />
          </>
        )}

        {isSpeaking && (
          <div className="absolute w-40 h-40 rounded-full border border-violet-400/40 animate-pulse pointer-events-none" />
        )}

        {/* Central Interactive Voice Orb Button */}
        <button
          onClick={onToggleListen}
          disabled={isProcessing}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
          className={`relative z-10 flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 ${
            isListening
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-2xl shadow-emerald-500/50 scale-105'
              : isSpeaking
              ? 'bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-2xl shadow-violet-500/50 scale-105 animate-pulse'
              : isProcessing
              ? 'bg-slate-900 border-2 border-amber-500/60 text-amber-400 cursor-wait'
              : 'bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700/80 text-emerald-400 hover:border-emerald-500/60 hover:text-emerald-300 hover:scale-105 shadow-xl shadow-slate-950/80'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : isSpeaking ? (
            <Volume2 className="w-10 h-10 animate-bounce" />
          ) : isListening ? (
            <Mic className="w-11 h-11 animate-pulse" />
          ) : (
            <Mic className="w-11 h-11" />
          )}
        </button>
      </div>

      {/* Audio Waveform Canvas Visualizer */}
      <div className="w-full max-w-md h-16 mt-4 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={360}
          height={64}
          className="w-full h-full"
        />
      </div>

      {/* Status indicator and prompt */}
      <div className="text-center mt-1">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800/80 text-xs font-medium text-slate-300 shadow-md">
          {isListening ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-300 font-semibold">Listening to speech...</span>
            </>
          ) : isSpeaking ? (
            <>
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-violet-300 font-semibold">Speaking response...</span>
            </>
          ) : isProcessing ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-spin" />
              <span className="text-amber-300 font-semibold">AI working out intent & executing actions...</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span>Tap microphone or try a demo prompt below</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

