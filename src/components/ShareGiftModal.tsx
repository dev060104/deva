'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Copy, Check, Share2, Sparkles, Gift, Heart, 
  Send, ExternalLink, MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { birthdayAudio } from '@/lib/birthdayAudio';
import { BirthdayTheme, GiftType, CelebrationRealm } from './Birthday3DScene';

interface ShareGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecipient: string;
  initialSender: string;
  initialAge: string | number;
  initialMessage: string;
  initialTheme: BirthdayTheme;
  initialRealm?: CelebrationRealm;
  initialGift: GiftType;
  onApplyGiftConfig: (config: {
    recipient: string;
    sender: string;
    age: string;
    message: string;
    theme: BirthdayTheme;
    realm: CelebrationRealm;
    gift: GiftType;
  }) => void;
}

export default function ShareGiftModal({
  isOpen,
  onClose,
  initialRecipient,
  initialSender,
  initialAge,
  initialMessage,
  initialTheme,
  initialRealm = 'forest',
  initialGift,
  onApplyGiftConfig,
}: ShareGiftModalProps) {
  const [recipient, setRecipient] = useState(initialRecipient);
  const [sender, setSender] = useState(initialSender);
  const [age, setAge] = useState(initialAge ? `${initialAge}` : '');
  const [message, setMessage] = useState(initialMessage);
  const [theme, setTheme] = useState<BirthdayTheme>(initialTheme);
  const [realm, setRealm] = useState<CelebrationRealm>(initialRealm);
  const [gift, setGift] = useState<GiftType>(initialGift);
  const [voiceFeeling, setVoiceFeeling] = useState<string>('for-her-radiant');
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRecipient(initialRecipient);
      setSender(initialSender);
      setAge(initialAge ? `${initialAge}` : '');
      setMessage(initialMessage);
      setTheme(initialTheme);
      if (initialRealm) setRealm(initialRealm);
      setGift(initialGift);
    }
  }, [isOpen, initialRecipient, initialSender, initialAge, initialMessage, initialTheme, initialRealm, initialGift]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const origin = window.location.origin;
    const params = new URLSearchParams();
    if (recipient) params.set('to', recipient.trim());
    if (sender) params.set('from', sender.trim());
    if (age) params.set('age', age.trim());
    if (theme) params.set('theme', theme);
    if (realm) params.set('bg', realm);
    if (gift) params.set('gift', gift);
    if (voiceFeeling) params.set('voice', voiceFeeling);
    if (message) params.set('msg', message.trim());

    setShareUrl(`${origin}/?${params.toString()}`);
  }, [recipient, sender, age, theme, realm, gift, voiceFeeling, message]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    birthdayAudio.playChime(1000, 0.2);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF69B4', '#00FFFF'],
    });

    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleApply = () => {
    onApplyGiftConfig({
      recipient: recipient.trim() || 'Bestie',
      sender: sender.trim() || 'With Love',
      age: age.trim() || '',
      message: message.trim() || 'Happy Birthday!',
      theme,
      realm,
      gift,
    });
    birthdayAudio.playUnboxFanfare();
    onClose();
  };

  const shareText = `🎉 Hey ${recipient || 'there'}! I created an interactive 3D Birthday Gift experience for you with secret surprises inside! Open and unbox your gift here: ${shareUrl}`;

  const openWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const openTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const openTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`🎉 A special 3D Birthday Gift for ${recipient}!`)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-[#0F1422] border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 text-white shadow-lg shadow-pink-500/25">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Create & Send 3D Gift</h3>
              <p className="text-xs text-slate-400">Generate a personalized 3D unboxing link for your friend</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Recipient Name</label>
              <input
                type="text"
                placeholder="e.g. Sophia"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 outline-none focus:border-pink-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Your Name (Sender)</label>
              <input
                type="text"
                placeholder="e.g. Alex"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 outline-none focus:border-pink-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Age (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 21"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 outline-none focus:border-pink-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Secret Surprise Message (Revealed when box opens)
            </label>
            <textarea
              rows={2}
              placeholder="Write a custom heartfelt, hilarious, or poetic secret wish..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 outline-none focus:border-pink-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Surprise Inside 3D Box</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cake', label: 'Tiered Cake 🎂' },
                { id: 'diamond', label: 'Crystal Gem 💎' },
                { id: 'trophy', label: 'VIP Trophy 🏆' },
                { id: 'heart', label: 'Radiant Heart 💖' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGift(g.id as GiftType)}
                  className={`p-2 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer ${
                    gift === g.id
                      ? 'bg-pink-500/20 border-pink-400 text-pink-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">3D Visual Aesthetic</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'royal-gold', label: '👑 Royal Gold' },
                { id: 'cosmic-nebula', label: '🌌 Cosmic Nebula' },
                { id: 'sakura-pastel', label: '🌸 Sakura Pastel' },
                { id: 'cyberpunk', label: '⚡ Cyberpunk' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as BirthdayTheme)}
                  className={`p-2 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer ${
                    theme === t.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Living World Background (Natural / Water / Forest)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'forest', icon: '🌲', label: 'Enchanted Forest' },
                { id: 'water', icon: '🌊', label: 'Ocean Lagoon' },
                { id: 'sakura', icon: '🌸', label: 'Sakura Garden' },
                { id: 'sunset', icon: '🌅', label: 'Sunset Oasis' },
                { id: 'aurora', icon: '🌌', label: 'Cosmic Aurora' },
                { id: 'royal', icon: '👑', label: 'Royal Palace' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRealm(r.id as CelebrationRealm);
                    birthdayAudio.playNatureChime(r.id as CelebrationRealm);
                  }}
                  className={`p-2 rounded-xl border text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    realm === r.id
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{r.icon}</span>
                  <span className="truncate">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-400 font-medium text-xs sm:text-sm">
                🎙️ Background Spoken Voiceover Feeling (For Him / Her)
              </label>
              <span className="text-[10px] text-pink-400 font-mono">HD Spoken Audio</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'for-her-radiant', label: '🌸 For Her: Radiant Love', desc: 'Warm, tender & romantic cadence' },
                { id: 'for-her-queen', label: '👑 For Her: Unstoppable Queen', desc: 'Empowering & elegant praise' },
                { id: 'for-him-champion', label: '🌟 For Him: Inspiring Champion', desc: 'Strong, deep & uplifting' },
                { id: 'for-him-brotherhood', label: '🥂 For Him: True Legend', desc: 'Loyal, warm & heartfelt' },
                { id: 'poetic-natural', label: '🌿 Serene Nature Blessing', desc: 'Tranquil & poetic peace' },
                { id: 'joyful-cheer', label: '🎉 Joyful Celebration', desc: 'Exciting, loud & fun' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVoiceFeeling(v.id);
                    birthdayAudio.playChime(800, 0.15);
                  }}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                    voiceFeeling === v.id
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-400 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{v.label}</span>
                    {voiceFeeling === v.id && <span className="text-pink-400 text-[10px] font-mono">✓ Active</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{v.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Personalized Share Link</span>
              <span className="text-[10px] text-emerald-400">Ready to Send</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-mono outline-none border border-slate-800"
              />
              <button
                onClick={handleCopy}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                }`}
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={openWhatsApp}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={openTwitter}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-400 text-xs font-bold transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>X (Twitter)</span>
            </button>
            <button
              onClick={openTelegram}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-400 text-xs font-bold transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </button>
          </div>

          <button
            onClick={handleApply}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold shadow-xl shadow-pink-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply to Live 3D Scene</span>
          </button>
        </div>

      </div>
    </div>
  );
}
