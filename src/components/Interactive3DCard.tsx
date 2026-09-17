'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Heart, Crown, Award, Printer, Copy, Check, 
  RotateCcw, Gift, Edit3, Image as ImageIcon, Smile
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { birthdayAudio } from '@/lib/birthdayAudio';

interface Interactive3DCardProps {
  recipientName: string;
  senderName: string;
  age: string | number;
  message: string;
  themeName?: string;
  onUpdateMessage?: (newMsg: string) => void;
}

export default function Interactive3DCard({
  recipientName = 'Sophia',
  senderName = 'With Love',
  age = '21',
  message = 'May your year ahead be as radiant, unstoppable, and joyful as your smile! ✨',
  themeName = 'Royal Gold',
  onUpdateMessage,
}: Interactive3DCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customMsg, setCustomMsg] = useState(message);
  const [activeStickers, setActiveStickers] = useState<string[]>(['🎂', '✨', '👑']);
  const [cardTheme, setCardTheme] = useState<'gold' | 'rose' | 'cosmic' | 'cyber'>('gold');

  const cardStyles = {
    gold: {
      coverBg: 'from-amber-900/90 via-[#1b152b] to-black',
      border: 'border-amber-400/60',
      accent: 'text-amber-300',
      foil: 'from-amber-300 via-yellow-200 to-amber-500',
      seal: 'from-amber-600 to-yellow-500',
    },
    rose: {
      coverBg: 'from-rose-950/90 via-[#26131e] to-black',
      border: 'border-pink-400/60',
      accent: 'text-pink-300',
      foil: 'from-pink-300 via-rose-200 to-pink-500',
      seal: 'from-pink-600 to-rose-500',
    },
    cosmic: {
      coverBg: 'from-indigo-950/90 via-[#0d142d] to-black',
      border: 'border-cyan-400/60',
      accent: 'text-cyan-300',
      foil: 'from-cyan-300 via-blue-200 to-purple-400',
      seal: 'from-indigo-600 to-cyan-500',
    },
    cyber: {
      coverBg: 'from-emerald-950/90 via-[#0a1f18] to-black',
      border: 'border-emerald-400/60',
      accent: 'text-emerald-300',
      foil: 'from-emerald-300 via-yellow-200 to-teal-400',
      seal: 'from-emerald-600 to-teal-500',
    },
  };

  const currentStyle = cardStyles[cardTheme];

  const toggleCard = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      birthdayAudio.playChime(750, 0.4);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFD700', '#FF69B4', '#00FFFF'],
      });
    } else {
      birthdayAudio.playChime(500, 0.2);
    }
  };

  const handleCopyCard = () => {
    const cardText = `✨ Birthday Greeting Card ✨\n\nTo: ${recipientName || 'Dear Friend'}\n\n"${customMsg}"\n\nWith Love,\n— ${senderName || 'Your Well-Wisher'}\n\n[Interactive 3D Vision Celebration]`;
    navigator.clipboard.writeText(cardText);
    setIsCopied(true);
    birthdayAudio.playChime(1000, 0.2);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FFD700', '#FF69B4', '#00FFFF'],
    });

    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleSticker = (sticker: string) => {
    birthdayAudio.playChime(900, 0.15);
    setActiveStickers((prev) => 
      prev.includes(sticker) ? prev.filter((s) => s !== sticker) : [...prev, sticker]
    );
  };

  return (
    <div className="w-full space-y-6 pt-4">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive 3D Keepsake</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Folding 3D Birthday Greeting Card
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Click the card to open and close with a realistic 3D paper fold animation.
          </p>
        </div>

        {/* Card Theme Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase px-2 hidden sm:inline">Cover:</span>
          {[
            { id: 'gold', label: '24K Gold' },
            { id: 'rose', label: 'Rosé Silk' },
            { id: 'cosmic', label: 'Cosmic' },
            { id: 'cyber', label: 'Cyber' },
          ].map((th) => (
            <button
              key={th.id}
              onClick={() => {
                setCardTheme(th.id as any);
                birthdayAudio.playChime(600, 0.2);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                cardTheme === th.id
                  ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {th.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Card Stage Viewport */}
      <div className="relative w-full max-w-4xl mx-auto min-h-[460px] sm:min-h-[500px] flex items-center justify-center p-4 [perspective:1400px]">
        
        {/* The 3D Folding Card Container */}
        <div 
          className={`relative w-full max-w-2xl h-[420px] sm:h-[460px] transition-all duration-700 [transform-style:preserve-3d] cursor-pointer select-none ${
            isOpen ? 'sm:translate-x-32' : ''
          }`}
          onClick={!isEditing ? toggleCard : undefined}
        >
          
          {/* INSIDE BASE (Right Page / Inside Letter) */}
          <div className="absolute inset-0 rounded-3xl bg-[#111422] border-2 border-amber-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
            
            {/* Background Texture & Ornaments */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400/40" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400/40" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400/40" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400/40" />

            {/* Letter Header */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-mono tracking-widest block font-bold">
                  Official Birthday Letter
                </span>
                <h4 className="text-xl sm:text-2xl font-serif font-black text-amber-200">
                  Dearest {recipientName || 'Friend'},
                </h4>
              </div>

              <div className="flex items-center gap-1 text-2xl">
                {activeStickers.map((s, idx) => (
                  <span key={idx} className="animate-bounce" style={{ animationDelay: `${idx * 0.15}s` }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Letter Body */}
            <div className="py-4 space-y-2 flex-1">
              {isEditing ? (
                <textarea
                  value={customMsg}
                  onChange={(e) => {
                    setCustomMsg(e.target.value);
                    if (onUpdateMessage) onUpdateMessage(e.target.value);
                  }}
                  rows={4}
                  className="w-full h-full p-3 rounded-2xl bg-black/50 border border-amber-500/40 text-amber-100 text-sm font-serif outline-none resize-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <p className="text-sm sm:text-base text-slate-200 font-serif italic leading-relaxed whitespace-pre-line">
                  "{customMsg}"
                </p>
              )}
            </div>

            {/* Letter Footer */}
            <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Milestone</span>
                <span className="text-amber-400 font-bold font-mono">
                  {age ? `${age} Wonderful Years` : 'Eternal Youth'}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Signed With Love</span>
                <span className="text-pink-300 font-serif font-bold text-sm">
                  — {senderName || 'Your Well-Wisher'}
                </span>
              </div>
            </div>

          </div>

          {/* FRONT FLAP (Folds open 180 degrees like a book cover) */}
          <div 
            className={`absolute inset-0 rounded-3xl border-2 shadow-2xl transition-transform duration-700 [transform-origin:left] [transform-style:preserve-3d] ${
              isOpen ? '[transform:rotateY(-165deg)]' : '[transform:rotateY(0deg)]'
            } bg-gradient-to-br ${currentStyle.coverBg} ${currentStyle.border}`}
          >
            
            {/* FRONT OF COVER (Visible when card is closed) */}
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-between text-center [backface-visibility:hidden]">
              
              {/* Top Ornate Seal */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-mono text-amber-400">
                  Exclusive Invitation
                </span>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${currentStyle.seal} p-0.5 mx-auto shadow-xl flex items-center justify-center`}>
                  <div className="w-full h-full rounded-full bg-black/60 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-amber-300 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Cover Title */}
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  To The One And Only
                </p>
                <h3 className={`text-3xl sm:text-4xl font-serif font-black bg-clip-text text-transparent bg-gradient-to-r ${currentStyle.foil}`}>
                  {recipientName || 'Birthday Star'}
                </h3>
                {age && (
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                    Chapter {age} Unlocked ✨
                  </span>
                )}
              </div>

              {/* Prompt to open */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Click to Open Card 💌</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Crafted by {senderName}
                </p>
              </div>

            </div>

            {/* INSIDE LEFT FLAP (Visible when card is opened - backface of cover) */}
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between bg-[#0e111d] rounded-3xl border-2 border-amber-500/30 [transform:rotateY(180deg)] [backface-visibility:hidden]">
              
              <div className="text-center space-y-1 border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">
                  Memory Keepsake
                </span>
                <h5 className="text-base font-bold text-white">Happy Birthday, {recipientName}!</h5>
              </div>

              {/* Polaroid Photo Frame */}
              <div className="w-48 sm:w-56 mx-auto bg-white p-3 rounded-2xl shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform">
                <div className="w-full h-36 sm:h-44 bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <Gift className="w-12 h-12 text-white relative z-10 animate-bounce" />
                  <span className="text-xs font-bold uppercase tracking-widest relative z-10 mt-1">
                    Special Day
                  </span>
                </div>
                <div className="pt-2 text-center">
                  <p className="text-slate-800 font-serif italic text-xs font-bold">
                    Celebrating {recipientName} • Forever Iconic
                  </p>
                </div>
              </div>

              {/* Interactive Sticker Tray */}
              <div className="pt-2 flex items-center justify-center gap-2">
                {['🎈', '🎂', '👑', '💖', '🍾', '🚀'].map((stk) => (
                  <button
                    key={stk}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSticker(stk);
                    }}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all cursor-pointer ${
                      activeStickers.includes(stk)
                        ? 'bg-amber-500/30 border border-amber-400 scale-110 shadow-md'
                        : 'bg-slate-900 border border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Card Controls & Actions */}
      <div className="max-w-xl mx-auto flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={toggleCard}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>{isOpen ? 'Close Card ✉️' : 'Open 3D Card 💌'}</span>
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
            isEditing 
              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' 
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Done Editing' : 'Edit Letter'}</span>
        </button>

        <button
          onClick={handleCopyCard}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            isCopied
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{isCopied ? 'Copied Card!' : 'Copy Text'}</span>
        </button>

        <button
          onClick={() => {
            birthdayAudio.playChime(800, 0.2);
            window.print();
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Keepsake</span>
        </button>
      </div>

    </div>
  );
}
