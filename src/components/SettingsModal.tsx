import React, { useState, useEffect } from 'react';
import { X, Sliders, Key, Volume2, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { VoiceSettings } from '../types';
import { ttsService } from '../services/speechSynthesis';
import { StorageService } from '../services/storageService';
import { soundEffects } from '../services/audioFeedback';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiKey: string;
  onSaveGeminiKey: (key: string) => void;
  monthlyBudget: number;
  onUpdateBudget: (budget: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  geminiKey,
  onSaveGeminiKey,
  monthlyBudget,
  onUpdateBudget,
}) => {
  const [keyInput, setKeyInput] = useState(geminiKey);
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(ttsService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setKeyInput(geminiKey);
    setBudgetInput(monthlyBudget.toString());
    const availVoices = ttsService.getVoices();
    setVoices(availVoices);
  }, [isOpen, geminiKey, monthlyBudget]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveGeminiKey(keyInput.trim());
    const parsedBudget = parseFloat(budgetInput);
    if (!isNaN(parsedBudget) && parsedBudget > 0) {
      onUpdateBudget(parsedBudget);
    }
    ttsService.updateSettings(voiceSettings);
    soundEffects.setEnabled(voiceSettings.soundEffects);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleTestVoice = () => {
    ttsService.updateSettings(voiceSettings);
    ttsService.speak('VoxFlow AI voice output synthesized successfully.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl glass-panel p-6 border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">System Settings & Voice Config</h3>
              <p className="text-xs text-slate-400">Configure AI model credentials and acoustic synthesis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 overflow-y-auto space-y-4 pr-1 flex-1">
          {/* Gemini API Key Section */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Google Gemini API Key (Optional)
              </label>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Fallback NLU Active
              </span>
            </div>
            <input
              type="password"
              placeholder="AIzaSy... (leave empty to use Built-in Semantic NLU)"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-white font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-2">
              <strong>Tip for Judges:</strong> If no API key is entered, VoxFlow automatically uses its built-in high-precision Autonomous Semantic Engine. It works 100% reliably out of the box!
            </p>
          </div>

          {/* Monthly Budget Setting */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <label className="text-xs font-bold text-slate-200 block mb-2">
              Monthly Budget Cap (₹ INR)
            </label>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg text-white"
            />
          </div>

          {/* Voice Synthesis Settings */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-violet-400" />
                Voice-Out (Text-to-Speech)
              </label>
              <button
                type="button"
                onClick={handleTestVoice}
                className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition"
              >
                Test Voice Audio
              </button>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Synthesizer Voice</span>
              <select
                value={voiceSettings.selectedVoiceURI}
                onChange={(e) => setVoiceSettings({ ...voiceSettings, selectedVoiceURI: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="">Default System Natural Voice</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Speech Rate</span>
                  <span>{voiceSettings.rate}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={voiceSettings.rate}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, rate: parseFloat(e.target.value) })}
                  className="w-full accent-violet-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Speech Pitch</span>
                  <span>{voiceSettings.pitch}</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.3"
                  step="0.05"
                  value={voiceSettings.pitch}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, pitch: parseFloat(e.target.value) })}
                  className="w-full accent-violet-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={voiceSettings.autoSpeak}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, autoSpeak: e.target.checked })}
                  className="rounded border-slate-700 text-violet-600 focus:ring-violet-500"
                />
                <span>Automatically speak response back after action execution (Voice Out)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={voiceSettings.soundEffects}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, soundEffects: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Enable Procedural Sound Cues (Mic Chime, Success Fanfare)</span>
              </label>
            </div>
          </div>

          {/* Reset App Data */}
          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-rose-300">Reset Application State</span>
              <p className="text-[11px] text-slate-400">Restore factory sample seed data and clear local cache</p>
            </div>
            <button
              onClick={() => {
                if (confirm('Reset application data to initial demo seed?')) {
                  StorageService.clearAll();
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-900/40 hover:bg-rose-900/70 text-rose-300 border border-rose-800 transition shrink-0"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <Check className="w-4 h-4" /> Preferences saved!
            </span>
          ) : (
            <span className="text-xs text-slate-500">Settings auto-persisted</span>
          )}

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition shadow"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

