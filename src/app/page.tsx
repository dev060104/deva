'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, Gift, Share2, Heart, Award, 
  Flame, Music, RefreshCw, Send, Check, Printer, FileText, ArrowRight
} from 'lucide-react';
import Birthday3DScene, { BirthdayTheme, GiftType, CelebrationRealm, REALM_CONFIGS } from '@/components/Birthday3DScene';
import TrendingWishesSection from '@/components/TrendingWishesSection';
import Interactive3DCard from '@/components/Interactive3DCard';
import ShareGiftModal from '@/components/ShareGiftModal';
import GreetingCardModal from '@/components/GreetingCardModal';
import confetti from 'canvas-confetti';
import { birthdayAudio } from '@/lib/birthdayAudio';

function BirthdayHomeContent() {
  const searchParams = useSearchParams();

  // Query parameter state or defaults
  const [recipient, setRecipient] = useState('Sophia');
  const [sender, setSender] = useState('With Love');
  const [age, setAge] = useState<string>('21');
  const [theme, setTheme] = useState<BirthdayTheme>('royal-gold');
  const [realm, setRealm] = useState<CelebrationRealm>('forest');
  const [giftType, setGiftType] = useState<GiftType>('cake');
  const [secretMessage, setSecretMessage] = useState(
    'May your year ahead be as radiant, unstoppable, and joyful as your smile! 🎂✨'
  );

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [hasReceivedSharedLink, setHasReceivedSharedLink] = useState(false);

  useEffect(() => {
    const toParam = searchParams.get('to');
    const fromParam = searchParams.get('from');
    const ageParam = searchParams.get('age');
    const themeParam = searchParams.get('theme') as BirthdayTheme | null;
    const bgParam = (searchParams.get('bg') || searchParams.get('realm')) as CelebrationRealm | null;
    const giftParam = searchParams.get('gift') as GiftType | null;
    const msgParam = searchParams.get('msg');

    if (toParam) {
      setRecipient(toParam);
      setHasReceivedSharedLink(true);
    }
    if (fromParam) setSender(fromParam);
    if (ageParam) setAge(ageParam);
    if (themeParam && ['royal-gold', 'cosmic-nebula', 'sakura-pastel', 'cyberpunk'].includes(themeParam)) {
      setTheme(themeParam);
    }
    if (bgParam && ['forest', 'water', 'sakura', 'sunset', 'aurora', 'royal'].includes(bgParam)) {
      setRealm(bgParam);
    }
    if (giftParam && ['cake', 'diamond', 'trophy', 'heart'].includes(giftParam)) {
      setGiftType(giftParam);
    }
    if (msgParam) setSecretMessage(msgParam);

    if (toParam || fromParam) {
      setTimeout(() => {
        birthdayAudio.playChime(600, 0.4);
      }, 500);
    }
  }, [searchParams]);

  const handleSelectWishFor3D = (wishText: string) => {
    setSecretMessage(wishText);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.4 },
      colors: ['#FFD700', '#FF69B4', '#00FFFF'],
    });
  };

  const handleApplyGiftConfig = (cfg: {
    recipient: string;
    sender: string;
    age: string;
    message: string;
    theme: BirthdayTheme;
    realm: CelebrationRealm;
    gift: GiftType;
  }) => {
    setRecipient(cfg.recipient);
    setSender(cfg.sender);
    setAge(cfg.age);
    setSecretMessage(cfg.message);
    setTheme(cfg.theme);
    setRealm(cfg.realm);
    setGiftType(cfg.gift);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-16">
      
      {/* Shared Link Banner (if opened via personalized link) */}
      {hasReceivedSharedLink && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-pink-900/60 via-purple-900/60 to-indigo-900/60 border-2 border-pink-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <Gift className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <p className="text-xs text-pink-300 font-mono font-bold uppercase tracking-wider">
                Personalized 3D Delivery
              </p>
              <h3 className="text-base sm:text-xl font-black text-white">
                {sender} has sent a personalized 3D Birthday Box for {recipient}!
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Click on the 3D gift box below to unwrap your celebration surprise!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold transition-all whitespace-nowrap cursor-pointer hover:scale-105"
          >
            Create One for a Friend 🎁
          </button>
        </div>
      )}

      {/* Hero Header */}
      <section className="text-center space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-indigo-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Next-Generation 3D Vision Celebration Experience</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Trending <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-400 to-indigo-400">Birthday Magic</span> in 3D
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Interactive 3D gift unboxing, tiered cakes with blowable candles and smoke physics, 3D fireworks, synthesized music-box melodies, and 40+ curated viral wishes.
        </p>

        {/* Quick Personalizer Pill Bar */}
        <div className="max-w-2xl mx-auto p-2 sm:p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-wrap items-center justify-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400">For:</span>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient name"
              className="bg-transparent text-white font-bold outline-none w-24 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400">Age:</span>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 21"
              className="bg-transparent text-white font-bold outline-none w-14 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400">From:</span>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Your name"
              className="bg-transparent text-white font-bold outline-none w-24 text-xs"
            />
          </div>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold transition-all hover:scale-105 shadow-md shadow-pink-600/30 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Personalize & Share</span>
          </button>

          <button
            onClick={() => setIsCardModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-medium transition-all cursor-pointer"
            title="View Printable Keepsake Card"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Keepsake Card</span>
          </button>
        </div>
      </section>

      {/* 3D WebGL Scene Stage */}
      <section className="space-y-3">
        <Birthday3DScene
          recipientName={recipient}
          senderName={sender}
          age={age}
          secretMessage={secretMessage}
          currentTheme={theme}
          currentRealm={realm}
          giftType={giftType}
          onRealmChange={(newRealm) => setRealm(newRealm)}
        />
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Living 3D Realms</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Switch between Natural Forest fireflies, Ocean Water ripples, Sakura petals & Sunset.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Interactive 3D Unboxing</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Click the velvet gift box to watch ribbons dissolve & surprise emerge.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Blowable 3D Candles</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Extinguish burning candles with realistic smoke puffs & fanfare.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Web Audio Music-Box</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Harmonized 8-bar Happy Birthday chimes with zero external audio latency.</p>
          </div>
        </div>
      </section>

      {/* Interactive 3D Greeting Card Section */}
      <Interactive3DCard
        recipientName={recipient}
        senderName={sender}
        age={age}
        message={secretMessage}
        themeName={theme.replace('-', ' ')}
        onUpdateMessage={(newMsg) => setSecretMessage(newMsg)}
      />

      {/* Trending Wishes Vault */}
      <TrendingWishesSection
        recipientName={recipient}
        age={age}
        onSelectWishFor3D={handleSelectWishFor3D}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Modals */}
      <ShareGiftModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        initialRecipient={recipient}
        initialSender={sender}
        initialAge={age}
        initialMessage={secretMessage}
        initialTheme={theme}
        initialRealm={realm}
        initialGift={giftType}
        onApplyGiftConfig={handleApplyGiftConfig}
      />

      <GreetingCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        recipientName={recipient}
        senderName={sender}
        age={age}
        message={secretMessage}
        themeName={theme.replace('-', ' ')}
      />

    </div>
  );
}

export default function StandaloneBirthdayApp() {
  return (
    <Suspense fallback={
      <div className="min-h-[500px] flex items-center justify-center text-slate-400 text-sm">
        <Sparkles className="w-6 h-6 animate-spin text-amber-400 mr-2" />
        Loading 3D Birthday Experience...
      </div>
    }>
      <BirthdayHomeContent />
    </Suspense>
  );
}
