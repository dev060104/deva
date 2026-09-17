'use client';

import React, { useRef, useState } from 'react';
import { X, Printer, Copy, Check, Sparkles, Heart, Crown, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { birthdayAudio } from '@/lib/birthdayAudio';

interface GreetingCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  senderName: string;
  age: string | number;
  message: string;
  themeName: string;
}

export default function GreetingCardModal({
  isOpen,
  onClose,
  recipientName,
  senderName,
  age,
  message,
  themeName,
}: GreetingCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    birthdayAudio.playChime(800, 0.2);
    window.print();
  };

  const handleCopyCard = () => {
    const cardText = `✨ Special Birthday Keepsake ✨\n\nDear ${recipientName || 'Friend'},\n\n"${message}"\n\nWith all my love and blessings,\n— ${senderName || 'Your Friend'}\n\n[Created via Birthday Magic 3D Vision Experience]`;
    navigator.clipboard.writeText(cardText);
    setIsCopied(true);
    birthdayAudio.playChime(1000, 0.2);

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#FFD700', '#FF69B4', '#00FFFF'],
    });

    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#0E131F] border border-amber-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-300">
              Golden Edition Keepsake
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={cardRef}
          className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1C1A27] via-[#151722] to-[#0D1017] border-2 border-amber-400/50 shadow-2xl space-y-6 text-center"
        >
          {/* Ornate Gold Corners */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

          {/* Golden Seal */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 text-slate-950 shadow-xl shadow-amber-500/30 mx-auto">
            <Crown className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] uppercase font-mono tracking-widest text-amber-400">
              Happy Birthday Celebration
            </p>
            <h3 className="text-2xl sm:text-3xl font-serif font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-pink-200 to-amber-300">
              {recipientName || 'Dear Friend'}
            </h3>
            {age && (
              <span className="inline-block text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
                Celebrating {age} Magnificent Years
              </span>
            )}
          </div>

          <div className="py-2 px-3 border-y border-amber-500/20">
            <p className="text-sm sm:text-base text-slate-200 italic font-serif leading-relaxed">
              "{message}"
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <div className="text-left">
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                Theme
              </span>
              <span className="text-amber-400 font-mono capitalize">{themeName}</span>
            </div>

            <div className="text-right">
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                Signed With Love
              </span>
              <span className="text-pink-300 font-serif font-semibold text-sm">
                — {senderName || 'Your Well-Wisher'}
              </span>
            </div>
          </div>

        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Keepsake</span>
          </button>

          <button
            onClick={handleCopyCard}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isCopied
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white shadow-lg shadow-amber-500/20'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied Card Text!' : 'Copy Card Text'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
