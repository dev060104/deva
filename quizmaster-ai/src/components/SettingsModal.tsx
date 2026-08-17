'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Volume2, VolumeX, Clock, Save, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getUserSettings, saveUserSettings, saveUserStats, DEFAULT_STATS } from '@/lib/storage';
import { UserSettings } from '@/lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<UserSettings>(getUserSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getUserSettings());
      setSavedSuccess(false);
      setConfirmReset(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveUserSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetData = () => {
    saveUserStats(DEFAULT_STATS);
    setConfirmReset(false);
    alert('User statistics and quiz history have been reset.');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111625] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">QuizMaster Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Custom API Key Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span>AI Provider & Custom API Key</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">Optional</span>
              </label>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              QuizMaster comes with a built-in AI engine that works 100% offline out-of-the-box. Add an OpenAI/Gemini API Key to unlock unlimited dynamic AI question synthesis!
            </p>

            <input
              type="password"
              placeholder="sk-..."
              value={settings.apiKey || ''}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-mono text-white placeholder-slate-600 outline-none transition-all"
            />
            
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Keys are stored locally in your browser session. Never sent to any external server.</span>
            </div>
          </div>

          <hr className="border-slate-800/80" />

          {/* Sound & Audio Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                Sound Effects & Haptics
              </span>
              <p className="text-xs text-slate-400">Play audio chimes for correct answers and timer alerts</p>
            </div>
            
            <button
              onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Question Timer Duration */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Timer Duration Per Question
            </label>
            
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSettings({ ...settings, timerDurationSeconds: sec })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    settings.timerDurationSeconds === sec
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {sec} Seconds
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-800/80" />

          {/* Reset User Data */}
          <div className="pt-1">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All History & Statistics</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2">
                <p className="text-xs text-rose-300 font-medium">Are you sure? This will wipe all streaks, scores, and history permanently.</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetData}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
